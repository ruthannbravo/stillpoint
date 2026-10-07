const view = document.getElementById("view");
const chakraById = Object.fromEntries(CHAKRAS.map((c) => [c.id, c]));
const meditationById = Object.fromEntries(MEDITATIONS.map((m) => [m.id, m]));

let lastQuery = "";
let homeFocus = null;
let libraryFilter = "all";

// Look up an id from the address bar only among the object's own entries,
// so names like "constructor" fall through to the normal fallback.
const own = (obj, key) => (key != null && Object.hasOwn(obj, key) ? obj[key] : undefined);

// Screen readers hear about changes that happen without a page load.
function announce(text) {
  const el = document.getElementById("announce");
  if (!el) return;
  el.textContent = "";
  setTimeout(() => (el.textContent = text), 50);
}

// Overlays (phone menu, image viewer) keep keyboard focus inside and make the page behind them inert.
const pageBehind = () => [document.querySelector(".nav"), view, document.querySelector(".foot")];
function setPageInert(on) {
  pageBehind().forEach((el) => el && (el.inert = on));
}
function keepFocusIn(box, e) {
  if (e.key !== "Tab") return;
  const items = [...box.querySelectorAll("a[href], button:not([disabled])")].filter((el) => el.tabIndex >= 0 && el.getClientRects().length);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// Arrow keys move between the options of a tab list or radio group, like native controls.
function arrowKeys(group, e, select) {
  const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: "first", End: "last" };
  if (!(e.key in keys)) return;
  const items = [...group.querySelectorAll('[role="tab"], [role="radio"]')];
  const i = items.indexOf(document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  e.stopPropagation();
  const k = keys[e.key];
  const next = k === "first" ? 0 : k === "last" ? items.length - 1 : (i + k + items.length) % items.length;
  items[next].focus();
  select(items[next]);
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

function setTheme(name, color) {
  document.body.dataset.theme = name;
  document.body.style.setProperty("--c", color || "");
}

// ---------- Matching ----------

function analyze(text) {
  const t = " " + text.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' -]/g, " ").replace(/\s+/g, " ") + " ";
  const has = (term) => t.includes(" " + term);

  const crisis = CRISIS_TERMS.some(has);
  const support = !crisis && SUPPORT_TERMS.some(has);
  const matched = [];
  const chakraScore = {};
  const medScore = {};
  const medReasons = {};

  for (const c of CONCERNS) {
    const hits = c.terms.filter(has).length;
    if (!hits) continue;
    matched.push({ label: c.label, hits });
    c.chakras.forEach((id, i) => (chakraScore[id] = (chakraScore[id] || 0) + hits * (i === 0 ? 2 : 1)));
    c.meditations.forEach((id, i) => {
      medScore[id] = (medScore[id] || 0) + hits * (3 - Math.min(i, 2));
      (medReasons[id] ||= []).push(`for ${c.label}`);
    });
  }

  // Direct mentions of a practice ("candle", "breathing", "tai chi") put it first.
  const words = [];
  const hasWord = (w) => new RegExp(`(^| )${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s|es)?( |$)`).test(t.trim());
  for (const [id, list] of Object.entries(MEDITATION_WORDS)) {
    const hit = list.find(hasWord);
    if (!hit) continue;
    words.push(hit);
    medScore[id] = (medScore[id] || 0) + 6;
    (medReasons[id] ||= []).unshift(`you mentioned “${hit}”`);
  }

  // A small nudge toward meditations that serve the top chakras.
  const rankedChakras = Object.entries(chakraScore).sort((a, b) => b[1] - a[1]);
  const top = rankedChakras[0]?.[1] || 0;
  const chakras = rankedChakras.filter(([, s]) => s >= top * 0.5).slice(0, 2).map(([id]) => id);
  chakras.forEach((id) => chakraById[id].meditations.forEach((m) => (medScore[m] = (medScore[m] || 0) + 0.5)));

  let meditations = Object.entries(medScore).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
  if (!meditations.length) meditations = ["vipassana", "pranayama", "body-scan"];

  return {
    crisis,
    support,
    concerns: matched.sort((a, b) => b.hits - a.hits).map((m) => m.label),
    chakras,
    meditations,
    reasons: medReasons,
    words,
  };
}

// ---------- Body stage ----------

const ICON = {
  l: '<path d="M14 6l-6 6 6 6"/>',
  r: '<path d="M10 6l6 6-6 6"/>',
  u: '<path d="M6 14l6-6 6 6"/>',
  d: '<path d="M6 10l6 6 6-6"/>',
  0: '<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4"/>',
};
const icon = (k, size = 18) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;

// Body controls stay tucked away until asked for; the choice sticks.
let showControls = false;
try { showControls = localStorage.getItem("stillpoint-controls") === "1"; } catch {}

function stageHTML() {
  return `
    <div class="stage ${showControls ? "show-controls" : ""}" id="stage">
      <div class="readout" id="readout"></div>
      <button class="controls-toggle glass" aria-expanded="${showControls}" aria-controls="stage">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>
        Controls
      </button>
      <div class="body-switch glass" role="group" aria-label="Body model">
        <button data-body="female" aria-pressed="${Body3D.getBodyType() === 'female'}">Female</button>
        <button data-body="male" aria-pressed="${Body3D.getBodyType() === 'male'}">Male</button>
      </div>
      <button class="surface-toggle glass" data-surface aria-pressed="${Body3D.getSurface() === 'contour'}">Contour lines</button>
      <div class="zoom-controls glass" role="group" aria-label="Zoom body">
        <button data-zoom="0.15" aria-label="Zoom in">+</button>
        <button data-zoom="-0.15" aria-label="Zoom out">−</button>
      </div>
      <div class="ctrl glass" role="group" aria-label="Turn the body">
        <button data-rot="l" aria-label="Turn left">${icon("l")}</button>
        <button data-rot="u" aria-label="Tilt up">${icon("u")}</button>
        <button data-rot="0" aria-label="Reset view">${icon("0", 16)}</button>
        <button data-rot="d" aria-label="Tilt down">${icon("d")}</button>
        <button data-rot="r" aria-label="Turn right">${icon("r")}</button>
      </div>
      <p class="drag-hint">Drag to turn · tap a light</p>
    </div>`;
}

function mountStage(opts) {
  const el = document.getElementById("stage");
  Body3D.mount(el, opts);
  const toggle = el.querySelector(".controls-toggle");
  toggle.addEventListener("click", () => {
    showControls = !showControls;
    el.classList.toggle("show-controls", showControls);
    toggle.setAttribute("aria-expanded", String(showControls));
    try { localStorage.setItem("stillpoint-controls", showControls ? "1" : "0"); } catch {}
  });
  el.querySelectorAll("[data-body]").forEach(button => button.addEventListener("click", () => {
    Body3D.setBodyType(button.dataset.body);
    el.querySelectorAll("[data-body]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
  }));
  el.querySelector("[data-surface]")?.addEventListener("click", e => {
    const on = Body3D.getSurface() !== "contour";
    Body3D.setSurface(on ? "contour" : "sculpture");
    e.currentTarget.setAttribute("aria-pressed", String(on));
  });
  el.querySelectorAll("[data-zoom]").forEach(b => b.addEventListener("click", () => Body3D.magnify(Number(b.dataset.zoom))));
  const moves = { l: [-0.45, 0], r: [0.45, 0], u: [0, -0.22], d: [0, 0.22] };
  el.querySelectorAll("[data-rot]").forEach((b) =>
    b.addEventListener("click", () => (b.dataset.rot === "0" ? Body3D.reset() : Body3D.nudge(...moves[b.dataset.rot])))
  );
}

function readout(c, label) {
  const n = CHAKRAS.length - CHAKRAS.indexOf(c);
  document.getElementById("readout").innerHTML = `
    <span class="num">${String(n).padStart(2, "0")}<em>/07</em></span>
    <span class="lbl">${c.name.toLowerCase()} chakra</span>
    <span class="tag glass">${label}</span>`;
}

function medCard(m, reason) {
  return `
    <a class="card glass" href="#/meditations/${m.id}">
      <span class="eyebrow">${esc(m.origin)}</span>
      <h3>${esc(m.name)}</h3>
      <p>${esc(m.summary)}</p>
      ${reason ? `<p class="why">${esc(reason)}</p>` : ""}
      <p class="helps"><span>Helps with</span>${m.usedFor.slice(0, 3).map((u) => esc(u.toLowerCase())).join(" · ")}</p>
      <span class="meta">${esc(m.duration)}</span>
    </a>`;
}

// ---------- Home ----------

// The search box grows with what's typed; when empty it stays one line, so the placeholder sits centred.
function growSearch(q) {
  if (!q) return;
  q.style.height = "";
  if (!q.value) return;
  q.style.height = "auto";
  q.style.height = q.scrollHeight + "px";
}
// Registered once (not on every visit to Find), and always measuring the box that's on screen now.
document.addEventListener("visibilitychange", () => growSearch(document.getElementById("q")));
addEventListener("resize", () => growSearch(document.getElementById("q")));

function renderHome() {
  setTheme("home");
  view.innerHTML = `
    <section class="hero ${lastQuery ? "compact" : "intro"}">
      <h1>${["What", "are", "you", "<em>carrying</em>", "today?"].map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ")}</h1>
      <p class="lede">Describe how you feel, in your own words. We'll find a meditation and show where it may be sitting in your body.</p>
      <form class="search glass" id="search" autocomplete="off">
        <textarea id="q" rows="1" placeholder="I've been feeling…" aria-label="Describe what you're going through">${esc(lastQuery)}</textarea>
        <button type="submit" aria-label="Find a meditation">${icon("r", 20)}</button>
      </form>
      <div class="prompts">${PROMPTS.map((p) => `<button type="button" class="bubble" data-prompt="${esc(p)}">${esc(p)}</button>`).join("")}</div>
    </section>
    <section id="results"></section>`;

  const q = document.getElementById("q");
  const grow = () => growSearch(q);
  q.addEventListener("input", grow);
  // re-measure if the page was laid out while hidden (e.g. opened in a background tab)
  q.addEventListener("focus", grow);
  q.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      submit();
    }
  });
  document.getElementById("search").addEventListener("submit", (e) => {
    e.preventDefault();
    submit();
  });
  view.querySelectorAll("[data-prompt]").forEach((b) =>
    b.addEventListener("click", () => {
      q.value = b.dataset.prompt;
      grow();
      submit();
    })
  );

  function submit() {
    const text = q.value.trim();
    if (!text) return q.focus();
    lastQuery = text;
    homeFocus = null;
    view.querySelector(".hero").classList.add("compact");
    renderResults(true);
  }

  grow();
  if (lastQuery) renderResults(false);
  else q.focus();
}

function renderResults(scroll) {
  const r = analyze(lastQuery);
  const el = document.getElementById("results");

  const crisis = r.crisis
    ? `<div class="care glass" role="alert">
        <strong>You don't have to hold this alone.</strong>
        It sounds like you're carrying something very heavy. If you're thinking about ending your life or hurting yourself,
        please call or text <a href="tel:988">988</a> (Canada &amp; US) or your local emergency number. You deserve real support right now.
        The practices below can help you through the next few minutes, alongside that support.
      </div>`
    : r.support
    ? `<div class="care glass" role="status">
        <strong>That sounds really heavy.</strong>
        The practices below can help you through the next few minutes. And if it ever starts to feel like too much,
        you can call or text <a href="tel:988">988</a> (Canada &amp; US) any time, to talk to someone.
      </div>`
    : "";

  const heard = r.concerns.length
    ? `<p class="heard">We're hearing <em>${r.concerns.slice(0, 3).map(esc).join("</em>, <em>")}</em></p>`
    : r.words.length
    ? `<p class="heard">Meditations for <em>${r.words.slice(0, 3).map((w) => esc(`“${w}”`)).join("</em>, <em>")}</em></p>`
    : `<p class="heard">We couldn't quite place that. Try describing how it feels in your mind or body. Here are three gentle places to start.</p>`;

  el.innerHTML = `
    ${crisis}
    ${heard}
    <section class="for-you">
      <h2 class="section-title">Meditations for you</h2>
      <div class="grid picks">${r.meditations.map((id) => medCard(meditationById[id], r.reasons[id]?.[0])).join("")}</div>
    </section>
    <h2 class="section-title">Where it may be sitting in your body</h2>
    <div class="results">
      ${stageHTML()}
      <div class="side">
        <div id="focus"></div>
      </div>
    </div>`;

  const showFocus = () => {
    const id = homeFocus || r.chakras[0];
    Body3D.update({ selected: id || null });
    const box = document.getElementById("focus");
    if (!id) {
      document.getElementById("readout").innerHTML = "";
      box.innerHTML = `<div class="focus glass"><p>Tap a light on the body, or choose a chakra from the list beside it, to explore it.</p></div>`;
      return;
    }
    const c = chakraById[id];
    const flagged = r.chakras.includes(id);
    readout(c, flagged ? "asking for attention" : "balanced for now");
    box.innerHTML = `
      <div class="focus glass" style="--c:${c.color}">
        <span class="eyebrow">${flagged ? "May be asking for attention" : "Chakra"}</span>
        <h3><i class="orb"></i>${c.name} <em>${c.sanskrit}</em></h3>
        <p>${c.theme}.</p>
        <ul>${c.blocked.slice(0, 3).map((b) => `<li>${b}</li>`).join("")}</ul>
        <a class="link" href="#/chakras/${c.id}">Explore the ${c.name.toLowerCase()} chakra →</a>
      </div>`;
  };

  const pick = (id) => {
    homeFocus = id;
    showFocus();
    document.querySelectorAll("#stage [data-pick]").forEach((b) => {
      b.classList.toggle("on", b.dataset.pick === id);
      b.setAttribute("aria-pressed", String(b.dataset.pick === id));
    });
  };
  mountStage({ highlight: r.chakras, onPick: pick });
  // the same picker as the chakras page, so the body can be explored without a mouse or 3D
  const current = homeFocus || r.chakras[0];
  document.getElementById("stage").insertAdjacentHTML("beforeend", `
    <div class="chakra-dots" role="group" aria-label="Choose a chakra">
      ${CHAKRAS.map((k) => `<button type="button" data-pick="${k.id}" class="${k.id === current ? "on" : ""}" style="--k:${k.color}" aria-label="${k.name} chakra" aria-pressed="${k.id === current}"><span>${k.name}</span><i></i></button>`).join("")}
    </div>`);
  document.querySelectorAll("#stage [data-pick]").forEach((b) => b.addEventListener("click", () => pick(b.dataset.pick)));
  showFocus();

  const care = r.crisis || r.support ? "Support is available any time: call or text 988 in Canada and the US. " : "";
  announce(`${care}${r.meditations.length} meditations suggested${r.concerns.length ? ` for ${r.concerns.slice(0, 3).join(", ")}` : ""}.`);
  el.classList.remove("in");
  void el.offsetWidth;
  el.classList.add("in");
  if (scroll) el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
}

// ---------- Meditations ----------

const FILTERS = [
  ["all", "All"],
  ["calm", "Calm"],
  ["sleep", "Sleep"],
  ["focus", "Focus"],
  ["heart", "Heart"],
  ["energy", "Energy"],
  ["grounding", "Grounding"],
];

function renderLibrary() {
  setTheme("library");
  const list = MEDITATIONS.filter((m) => libraryFilter === "all" || m.tags.includes(libraryFilter));
  view.innerHTML = `
    <section class="page-head center">
      <h1>Move towards <em>what brings you…</em></h1>
      <p class="lede">Fourteen practices from traditions around the world. Choose one to learn where it comes from and how to begin.</p>
      <div class="filters" role="group" aria-label="Filter meditations">
        ${FILTERS.map(([k, label]) => `<button class="bubble ${k === libraryFilter ? "on" : ""}" data-filter="${k}" aria-pressed="${k === libraryFilter}">${label}</button>`).join("")}
      </div>
    </section>
    <section class="grid fade">${list.map((m) => medCard(m)).join("")}</section>`;

  view.querySelectorAll("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      libraryFilter = b.dataset.filter;
      renderLibrary();
      view.querySelector(`[data-filter="${libraryFilter}"]`)?.focus();
      const label = FILTERS.find(([k]) => k === libraryFilter)[1];
      announce(`${view.querySelectorAll(".grid .card").length} meditations${libraryFilter === "all" ? "" : `: ${label}`}.`);
    })
  );
}

const STEPS = ["Practice", "Practice along", "History"];

// "Practice along": YouTube videos plus the same kind of session on Spotify and Apple Music
const PLAY = `<span class="play"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5.5v13l10-6.5z" fill="currentColor"/></svg></span>`;
const ALONG = [
  ["videos", "Video", "YouTube", (id) => `https://www.youtube.com/watch?v=${id}`],
  ["spotify", "Spotify", "Spotify", (id) => `https://open.spotify.com/track/${id}`],
  ["apple", "Apple Music", "Apple Music", (id) => `https://music.apple.com/us/song/${id}`],
];
function alongHTML(media) {
  const tabs = ALONG.filter(([key]) => (media[key] || []).length);
  if (!tabs.length) return "";
  return `
    <div class="along-tabs" role="tablist" aria-label="Practice along">${tabs.map(([key, label], i) => `
      <button role="tab" id="along-tab-${key}" data-along="${key}" aria-controls="along-panel-${key}" aria-selected="${i ? "false" : "true"}" tabindex="${i ? "-1" : "0"}">${label}</button>`).join("")}
    </div>
    ${tabs.map(([key, , where, url], i) => `
      <div class="along" role="tabpanel" id="along-panel-${key}" aria-labelledby="along-tab-${key}" data-along-panel="${key}" ${i ? "hidden" : ""}>
        <div class="vids">${media[key].map(([title, id, by, length, views], n) => `
          <a class="vid" href="${esc(url(id))}" target="_blank" rel="noopener noreferrer">
            <em>${two(n + 1)}</em>
            <strong>${esc(title)}<small>${esc(by)} · ${esc(length)}${views ? ` · ${esc(views)} views` : ""}</small></strong>
            ${PLAY}
          </a>`).join("")}
        </div>
        <p class="note">Opens in ${where}${key === "videos" ? "" : ". Full sessions need a subscription or free account"}.</p>
      </div>`).join("")}`;
}

function renderMeditation(id, section) {
  const m = own(meditationById, id);
  if (!m) return renderLibrary();
  const media = MEDIA[m.id] || {};
  setTheme("library");

  const past = HISTORY[m.id] || { images: [], milestones: [] };
  const archive = past.images.length
    ? `<aside class="archive">
        ${past.images.map((img, i) => `
          <figure class="plate ${i ? "" : "on"}" data-plate="${i}">
            <a href="${img.page}" target="_blank" rel="noopener" aria-label="View full image"><img src="${img.src}" alt="${esc(img.caption)}" loading="lazy" style="object-position:${img.focus || "50% 30%"}" /></a>
            <figcaption>${esc(img.caption)}<small>${esc(img.credit)}</small></figcaption>
          </figure>`).join("")}
        ${past.images.length > 1 ? `<div class="plate-dots">${past.images.map((_, i) => `<button data-show="${i}" class="${i ? "" : "on"}" aria-label="Image ${i + 1}"></button>`).join("")}</div>` : ""}
      </aside>`
    : "";

  const slides = [
    `<div class="ed">
      <span class="eyebrow">People turn to it for</span>
      <h2>What it's used for</h2>
      <ol class="uses compact">${m.usedFor.map((u, i) => `<li><em>${two(i + 1)}</em>${esc(u)}</li>`).join("")}</ol>
      <span class="eyebrow how-eyebrow">A simple way to begin</span>
      <h2>How to practice</h2>
      <dl class="meta">
        <div><dt>Time</dt><dd>${esc(m.duration)}</dd></div>
        <div><dt>Chakras</dt><dd>${m.chakras.map((c) => `<a href="#/chakras/${c}" class="pill" style="--c:${chakraById[c].color}">${chakraById[c].name}</a>`).join("")}</dd></div>
      </dl>
      <ol class="how">${m.steps.map((s, i) => `<li><em>${two(i + 1)}</em><span>${esc(s)}</span></li>`).join("")}</ol>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">Watch or listen</span>
      <h2>Practice along</h2>
      ${alongHTML(media)}
    </div>`,
    `<div class="ed">
      <span class="eyebrow">${esc(m.origin)} · ${esc(m.era)}</span>
      <h2>Where it comes from</h2>
      <div class="flow">
        ${archive}
        ${m.history.map((p, i) => `<p class="${i ? "" : "lead"}">${esc(p)}</p>`).join("")}
      </div>
      ${past.milestones.length ? `
        <h3 class="dates-title">Key dates <small>Hover to look closer · scroll sideways for more</small></h3>
        <ol class="dates">${past.milestones.map(([when, what]) => `
          <li tabindex="0"><span class="when">${esc(when)}</span><span class="what">${esc(what)}</span></li>`).join("")}
        </ol>` : ""}
    </div>`,
  ];

  view.innerHTML = `
    <article class="med fade">
      ${backTo
        ? `<a class="back" href="${esc(backTo.hash)}">${icon("l", 16)} Back to ${esc(backTo.label)}</a>`
        : `<a class="back" href="#/meditations">${icon("l", 16)} All meditations</a>`}
      <header class="med-head">
        <h1>${esc(m.name)}</h1>
        <p class="alt">${esc(m.alt)} — ${esc(m.summary)}</p>
      </header>
      ${stepperHTML(STEPS)}
    </article>`;

  // "#/meditations/<id>/<section>" opens on that section (Practice by default)
  let want = "practice";
  try { want = decodeURIComponent(section || "practice").toLowerCase(); } catch {}
  const start = Math.max(0, STEPS.findIndex((s) => s.toLowerCase() === want));
  stepper(view.querySelector(".med"), slides, STEPS, { start });
  const showAlong = (tab) => {
    const box = tab.closest(".ed");
    box.querySelectorAll("[data-along]").forEach((b) => {
      b.setAttribute("aria-selected", String(b === tab));
      b.tabIndex = b === tab ? 0 : -1;
    });
    box.querySelectorAll("[data-along-panel]").forEach((p) => (p.hidden = p.dataset.alongPanel !== tab.dataset.along));
  };
  view.querySelector(".med").addEventListener("click", (e) => {
    const tab = e.target.closest("[data-along]");
    if (tab) showAlong(tab);
  });
  view.querySelector(".med").addEventListener("keydown", (e) => {
    const list = e.target.closest?.(".along-tabs");
    if (list) arrowKeys(list, e, showAlong);
  });
}

// ---------- Stepper: edge-to-edge timeline + sliding sections ----------

const two = (n) => String(n).padStart(2, "0");

function stepperHTML(labels) {
  return `
    <nav class="timeline" aria-label="Sections" style="--n:${labels.length}">
      <div class="track"><i class="fill"></i></div>
      ${labels.map((label, i) => `
        <button class="node" data-step="${i}" aria-label="${label}">
          <i></i><span><em>${two(i + 1)}</em>${label}</span>
        </button>`).join("")}
    </nav>
    <section class="slide" aria-live="polite"></section>
    <footer class="pager">
      <p class="count"></p>
      <div class="pager-btns">
        <button class="arrow prev" aria-label="Previous section">${icon("l")}</button>
        <button class="arrow next" aria-label="Next section"><span class="next-label"></span>${icon("r")}</button>
      </div>
    </footer>`;
}

function stepper(root, slides, labels, { start = 0, onChange } = {}) {
  const slide = root.querySelector(".slide");
  const $ = (sel) => root.querySelector(sel);
  let step = -1;

  const go = (next) => {
    next = Math.max(0, Math.min(labels.length - 1, next));
    if (next === step) return;
    const dir = next >= step ? "from-right" : "from-left";
    step = next;
    slide.innerHTML = slides[step];
    slide.classList.remove("from-right", "from-left");
    void slide.offsetWidth;
    slide.classList.add(dir);
    root.querySelectorAll(".node").forEach((n, i) => {
      n.classList.toggle("done", i < step);
      n.classList.toggle("on", i === step);
      n.setAttribute("aria-current", i === step ? "step" : "false");
    });
    $(".fill").style.width = `${(step / (labels.length - 1)) * 100}%`;
    $(".prev").disabled = step === 0;
    $(".next").disabled = step === labels.length - 1;
    $(".count").innerHTML = `${two(step + 1)}<em>/${two(labels.length)}</em>`;
    $(".next-label").textContent = step < labels.length - 1 ? labels[step + 1] : "";
    enhanceSlide(slide);
    onChange?.(step);
  };

  root.querySelectorAll(".node").forEach((n) => n.addEventListener("click", () => go(+n.dataset.step)));
  $(".prev").addEventListener("click", () => go(step - 1));
  $(".next").addEventListener("click", () => go(step + 1));

  // swipe / drag sideways, and horizontal trackpad scroll
  let sx = null;
  slide.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" && !e.target.closest("a, button, .dates")) sx = e.clientX; });
  slide.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 50) go(step + (dx < 0 ? 1 : -1));
  });
  let wheelLock = 0;
  slide.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 25 || e.target.closest(".dates")) return;
    e.preventDefault();
    if (Date.now() < wheelLock) return;
    wheelLock = Date.now() + 700;
    go(step + (e.deltaX > 0 ? 1 : -1));
  }, { passive: false });

  const onKey = (e) => {
    if (!document.body.contains(slide)) return removeEventListener("keydown", onKey);
    if (document.querySelector(".lightbox")) return;
    if (e.target.closest?.('input, textarea, canvas, select, [role="tablist"], [role="radiogroup"], [role="group"]')) return;
    if (document.body.classList.contains("menu-open")) return;
    if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.key === "ArrowRight") go(step + 1);
    if (e.key === "ArrowLeft") go(step - 1);
  };
  addEventListener("keydown", onKey, { signal: pageSignal() });

  go(start);
}

// Wire up interactive bits inside a freshly rendered slide.
function enhanceSlide(slide) {
  slide.querySelectorAll("[data-show]").forEach((b) =>
    b.addEventListener("click", () => {
      slide.querySelectorAll(".plate, [data-show]").forEach((el) => el.classList.remove("on"));
      slide.querySelector(`[data-plate="${b.dataset.show}"]`).classList.add("on");
      b.classList.add("on");
    })
  );

  // Tall images get a consistent 4:5 crop around their subject.
  slide.querySelectorAll(".plate img").forEach((img) => {
    const fit = () => img.classList.toggle("tall", img.naturalHeight / img.naturalWidth > 1.3);
    img.complete ? fit() : img.addEventListener("load", fit, { once: true });
  });

  slide.querySelectorAll(".plate a").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(a.closest(".plate"));
    })
  );

  const dates = slide.querySelector(".dates");
  if (dates) {
    // vertical wheel over the key dates scrolls them sideways
    dates.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || dates.scrollWidth <= dates.clientWidth) return;
      const atEnd = e.deltaY > 0 ? dates.scrollLeft + dates.clientWidth >= dates.scrollWidth - 2 : dates.scrollLeft <= 0;
      if (atEnd) return;
      e.preventDefault();
      dates.scrollLeft += e.deltaY;
    }, { passive: false });
  }
}

function openLightbox(plate) {
  const img = plate.querySelector("img");
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", img.alt);
  const opener = plate.querySelector("a");
  box.innerHTML = `
    <button class="lb-close" aria-label="Close">×</button>
    <img src="${esc(img.src)}" alt="${esc(img.alt)}" />
    <p>${esc(plate.querySelector("figcaption").firstChild.textContent)}<small>${esc(plate.querySelector("figcaption small").textContent)}</small> <a href="${esc(plate.querySelector("a").href)}" target="_blank" rel="noopener noreferrer">View source ↗</a></p>`;
  const close = () => {
    if (!box.isConnected || box.classList.contains("out")) return;
    box.classList.add("out");
    setTimeout(() => box.remove(), 300);
    removeEventListener("keydown", onKey);
    removeEventListener("hashchange", close);
    setPageInert(false);
    if (opener?.isConnected) opener.focus();
  };
  const onKey = (e) => {
    if (e.key === "Escape") close();
    else keepFocusIn(box, e);
  };
  box.addEventListener("click", (e) => { if (!e.target.closest("a")) close(); });
  addEventListener("keydown", onKey);
  addEventListener("hashchange", close);
  document.body.append(box);
  setPageInert(true);
  box.querySelector(".lb-close").focus();
}

// ---------- Chakras ----------

const CHAKRA_STEPS = ["What it is", "Signs of a block", "In balance", "How to unblock", "Meditations"];
let chakraStep = 0;

function renderChakras(id) {
  const c = own(chakraById, id) || chakraById.heart;
  setTheme("chakra", c.color);

  const slides = [
    `<div class="ed">
      <span class="eyebrow">${esc(c.theme)}</span>
      <h2>What it is</h2>
      <p class="lead">${c.about}</p>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">You may notice</span>
      <h2>Signs it may be blocked</h2>
      <ol class="uses signs-list">${c.blocked.map((b, i) => `<li><em>${two(i + 1)}</em>${b}</li>`).join("")}</ol>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">When energy flows</span>
      <h2>When it's balanced</h2>
      <ol class="uses signs-list open">${c.balanced.map((b, i) => `<li><em>${two(i + 1)}</em>${b}</li>`).join("")}</ol>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">Everyday practices</span>
      <h2>How to unblock it</h2>
      <ol class="how">${c.practices.map((p, i) => `<li><em>${two(i + 1)}</em><span>${p}</span></li>`).join("")}</ol>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">Practices that help</span>
      <h2>Meditations</h2>
      <div class="vids">
        ${c.meditations.map((mid, i) => {
          const m = meditationById[mid];
          return `
          <a class="vid" href="#/meditations/${m.id}">
            <em>${two(i + 1)}</em>
            <strong>${esc(m.name)}<small>${esc(m.origin)} · ${esc(m.duration)}</small></strong>
            <span class="play">${icon("r", 18)}</span>
          </a>`;
        }).join("")}
      </div>
    </div>`,
  ];

  view.innerHTML = `
    <div class="chakra-page" style="--c:${c.color}">
      <div class="body-pane">
        ${stageHTML()}
        <p class="chakra-note">Click a chakra on the body to explore it<span> · Chakras are a traditional framework, not a medical diagnosis</span></p>
      </div>
      <article class="chakra-read fade">
        <header class="chakra-head">
          <span class="eyebrow">${c.location}</span>
          <h1>${c.name}<em>${c.sanskrit}</em></h1>
          <p class="alt">“${c.meaning}”</p>
          <dl class="meta">
            <div><dt>Element</dt><dd>${c.element}</dd></div>
            <div><dt>Seed sound</dt><dd>${c.mantra}</dd></div>
            <div><dt>Color</dt><dd><i class="swatch"></i></dd></div>
          </dl>
        </header>
        ${stepperHTML(CHAKRA_STEPS)}
      </article>
    </div>`;

  mountStage({
    highlight: [c.id],
    selected: c.id,
    focus: c.id,
    onPick: (next) => (location.hash = `#/chakras/${next}`),
  });
  readout(c, c.theme.split(",")[0].toLowerCase());
  // a simple picker beside the body, for anyone who doesn't think to tap the lights
  document.getElementById("stage").insertAdjacentHTML("beforeend", `
    <nav class="chakra-dots" aria-label="Choose a chakra">
      ${CHAKRAS.map((k) => `<a href="#/chakras/${k.id}" class="${k.id === c.id ? "on" : ""}" style="--k:${k.color}" aria-label="${k.name} chakra"${k.id === c.id ? ' aria-current="page"' : ""}><span>${k.name}</span><i></i></a>`).join("")}
    </nav>`);
  // keep the reader on the same section while hopping between chakras
  stepper(view.querySelector(".chakra-read"), slides, CHAKRA_STEPS, { start: chakraStep, onChange: (s) => (chakraStep = s) });
  view.querySelector(".chakra-read").addEventListener("click", (e) => {
    if (e.target.closest("a.vid")) backTo = { hash: `#/chakras/${c.id}`, label: `the ${c.name.toLowerCase()} chakra` };
  });
}

// ---------- Guide ----------

// Where a meditation page's back link should return to (a guide week or a chakra).
let backTo = null;
const guideStep = {};

function renderGuide(level) {
  setTheme("library");
  const plan = own(GUIDE, level);
  if (!plan) {
    view.innerHTML = `
      <section class="guide-pick fade">
        <span class="eyebrow">Guide</span>
        <h1>Where are you <em>starting</em> from?</h1>
        <p class="lede">Choose your level and we'll give you a gentle four-week plan to begin.</p>
        <div class="levels">
          ${Object.entries(GUIDE).map(([key, g], i) => `
            <a class="level" href="#/guide/${key}" style="--i:${i}">
              <em>${two(i + 1)}</em>
              <strong>${g.label}</strong>
              <span>${g.blurb}</span>
              <small>${g.daily}</small>
            </a>`).join("")}
        </div>
        <p class="note">Meditation is generally safe, but if you're living with trauma or a mental health condition, talk to a professional before longer or more intensive practice.</p>
      </section>`;
    return;
  }

  const labels = plan.weeks.map((w, i) => `Week ${i + 1}`);
  const slides = plan.weeks.map((w, i) => `
    <div class="ed">
      <span class="eyebrow">Week ${i + 1} · ${esc(w.time)}</span>
      <h2>${esc(w.title)}</h2>
      <p class="lead">${esc(w.intro)}</p>
      <div class="vids">
        ${w.practices.map(([id, note], j) => {
          const m = meditationById[id];
          return `
          <a class="vid" href="#/meditations/${m.id}/practice">
            <em>${two(j + 1)}</em>
            <strong>${esc(m.name)}<small>${esc(note)}</small></strong>
            <span class="play">${icon("r", 18)}</span>
          </a>`;
        }).join("")}
      </div>
      <aside class="tip">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v2M5.6 5.6l1.4 1.4M3 12h2M18.4 5.6 17 7M21 12h-2"/><path d="M9 17h6M10 20h4M8.5 13.5A4.5 4.5 0 1 1 15.5 13.5c-.8.7-1.5 1.6-1.5 2.5h-4c0-.9-.7-1.8-1.5-2.5Z"/></svg>
        <div><span>A gentle tip</span><p>${esc(w.tip)}</p></div>
      </aside>
    </div>`);

  view.innerHTML = `
    <article class="med guide fade">
      <a class="back" href="#/guide">${icon("l", 16)} Change level</a>
      <header class="med-head">
        <span class="eyebrow">Your ${plan.label.toLowerCase()} plan · ${plan.daily}</span>
        <h1>${plan.label}</h1>
        <p class="alt">${esc(plan.intro)}</p>
      </header>
      ${stepperHTML(labels)}
    </article>`;
  const root = view.querySelector(".guide");
  stepper(root, slides, labels, { start: guideStep[level] || 0, onChange: (s) => (guideStep[level] = s) });
  root.addEventListener("click", (e) => {
    if (e.target.closest("a.vid")) backTo = { hash: `#/guide/${level}`, label: `your ${plan.label.toLowerCase()} plan · Week ${(guideStep[level] || 0) + 1}` };
  });
}

// ---------- Router ----------

let lastPage = null;
let pageAbort = new AbortController();
// listeners tied to the current page pass this signal, so they go away when the page changes
const pageSignal = () => pageAbort.signal;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function route() {
  pageAbort.abort();
  pageAbort = new AbortController();
  const fromPicker = !!document.activeElement?.closest?.(".chakra-dots");
  const [, page = "", id, sub] = location.hash.replace(/^#/, "").split("/");
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const current = a.dataset.nav === (page || "home");
    a.classList.toggle("on", current);
    if (current) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  // a remembered "back" only applies to the meditation page opened from it
  if (page !== "meditations" || !id) {
    if (!["guide", "chakras"].includes(page)) backTo = null;
  }
  if (page === "meditations") id ? renderMeditation(id, sub) : renderLibrary();
  else if (page === "chakras") renderChakras(id);
  else if (page === "guide") renderGuide(id);
  else renderHome();
  if (page !== "chakras" || !id) window.scrollTo(0, 0);
  // name the page in the tab title, and on moving to another page put focus on its heading
  const heading = view.querySelector("h1");
  const name = page && heading ? [...heading.childNodes].map((n) => n.textContent.trim()).filter(Boolean).join(" ") : "";
  document.title = name ? `${name} · Stillpoint` : "Stillpoint";
  // hopping between chakras with the picker keeps focus on it; any other navigation moves focus to the new heading
  const hopping = page === "chakras" && lastPage === "chakras";
  const currentDot = hopping && fromPicker ? view.querySelector('.chakra-dots [aria-current="page"]') : null;
  if (currentDot) currentDot.focus({ preventScroll: true });
  else if (lastPage !== null && page && heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  lastPage = page;
}

// Background scene: green hills or calm water, remembered between visits.
function setScene(scene) {
  document.body.dataset.scene = scene;
  document.documentElement.dataset.scene = scene;
  // phones colour their status bar from this; match the top of the photo so it blends in
  const sky = { hills: "#6c7b6c", water: "#6b889f", sunrise: "#b18e87" }[scene];
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.append(meta); }
  meta.content = sky;
  document.querySelectorAll("button[data-scene]").forEach((b) => {
    b.setAttribute("aria-checked", String(b.dataset.scene === scene));
    b.tabIndex = b.dataset.scene === scene ? 0 : -1;
  });
  try { localStorage.setItem("stillpoint-scene", scene); } catch {}
}
let savedScene = "hills";
try { const v = localStorage.getItem("stillpoint-scene"); if (["water", "sunrise"].includes(v)) savedScene = v; } catch {}
setScene(savedScene);
document.querySelectorAll("button[data-scene]").forEach((b) => b.addEventListener("click", () => setScene(b.dataset.scene)));
document.querySelectorAll('[role="radiogroup"]').forEach((g) => g.addEventListener("keydown", (e) => arrowKeys(g, e, (b) => setScene(b.dataset.scene))));

// Small screens: one Menu button opens a full-screen sheet.
const menuBtn = document.querySelector(".menu-btn");
const menuSheet = document.getElementById("menu-sheet");
function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  setPageInert(open);
  if (open) {
    menuSheet.hidden = false;
    requestAnimationFrame(() => menuSheet.classList.add("open"));
    menuSheet.querySelector(".menu-close").focus();
  } else {
    menuSheet.classList.remove("open");
    setTimeout(() => { if (!menuSheet.classList.contains("open")) menuSheet.hidden = true; }, 450);
  }
  document.body.classList.toggle("menu-open", open);
}
menuBtn.addEventListener("click", () => setMenu(true));
matchMedia("(min-width: 761px)").addEventListener("change", (e) => { if (e.matches && !menuSheet.hidden) setMenu(false); });
menuSheet.querySelector(".menu-close").addEventListener("click", () => { setMenu(false); menuBtn.focus(); });
menuSheet.querySelectorAll(".menu-links a").forEach((a) => a.addEventListener("click", () => {
  setMenu(false);
  // a new page puts focus on its heading; staying on the same page returns it to the Menu button
  setTimeout(() => { if (menuSheet.contains(document.activeElement) || document.activeElement === document.body) menuBtn.focus(); }, 60);
}));
addEventListener("keydown", (e) => {
  if (menuSheet.hidden) return;
  if (e.key === "Escape") { setMenu(false); menuBtn.focus(); }
  else keepFocusIn(menuSheet, e);
});

// The chakras page sizes itself to the window below the nav.
const setNavHeight = () =>
  document.documentElement.style.setProperty("--nav-h", `${document.querySelector(".nav").offsetHeight}px`);
setNavHeight();
window.addEventListener("resize", setNavHeight);

document.querySelector(".skip-link")?.addEventListener("click", () => {
  const target = view.querySelector("h1") || view;
  target.tabIndex = -1;
  target.focus();
});

window.addEventListener("hashchange", route);
route();
