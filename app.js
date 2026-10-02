const view = document.getElementById("view");
const chakraById = Object.fromEntries(CHAKRAS.map((c) => [c.id, c]));
const meditationById = Object.fromEntries(MEDITATIONS.map((m) => [m.id, m]));

let lastQuery = "";
let homeFocus = null;
let libraryFilter = "all";

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
  const grow = () => {
    q.style.height = "auto";
    q.style.height = q.scrollHeight + "px";
  };
  q.addEventListener("input", grow);
  // re-measure if the page was laid out while hidden (e.g. opened in a background tab)
  q.addEventListener("focus", grow);
  document.addEventListener("visibilitychange", grow);
  addEventListener("resize", grow);
  q.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
    ? `<div class="care glass">
        <strong>You don't have to hold this alone.</strong>
        It sounds like you're carrying something very heavy. If you're thinking about ending your life or hurting yourself,
        please call or text <a href="tel:988">988</a> (Canada &amp; US) or your local emergency number. You deserve real support right now.
        The practices below can help you through the next few minutes, alongside that support.
      </div>`
    : r.support
    ? `<div class="care glass">
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
      box.innerHTML = `<div class="focus glass"><p>Tap any light on the body to explore that chakra.</p></div>`;
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

  mountStage({
    highlight: r.chakras,
    onPick: (id) => {
      homeFocus = id;
      showFocus();
    },
  });
  showFocus();

  el.classList.remove("in");
  void el.offsetWidth;
  el.classList.add("in");
  if (scroll) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <div class="filters" role="tablist">
        ${FILTERS.map(([k, label]) => `<button class="bubble ${k === libraryFilter ? "on" : ""}" data-filter="${k}" role="tab" aria-selected="${k === libraryFilter}">${label}</button>`).join("")}
      </div>
    </section>
    <section class="grid fade">${list.map((m) => medCard(m)).join("")}</section>`;

  view.querySelectorAll("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      libraryFilter = b.dataset.filter;
      renderLibrary();
    })
  );
}

const STEPS = ["History", "Used for", "Practice", "Videos"];

function renderMeditation(id, section) {
  const m = meditationById[id];
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
    `<div class="ed">
      <span class="eyebrow">People turn to it for</span>
      <h2>What it's used for</h2>
      <ol class="uses">${m.usedFor.map((u, i) => `<li><em>${two(i + 1)}</em>${esc(u)}</li>`).join("")}</ol>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">A simple way to begin</span>
      <h2>How to practice</h2>
      <dl class="meta">
        <div><dt>Time</dt><dd>${esc(m.duration)}</dd></div>
        <div><dt>Chakras</dt><dd>${m.chakras.map((c) => `<a href="#/chakras/${c}" class="pill" style="--c:${chakraById[c].color}">${chakraById[c].name}</a>`).join("")}</dd></div>
      </dl>
      <ol class="how">${m.steps.map((s, i) => `<li><em>${two(i + 1)}</em><span>${esc(s)}</span></li>`).join("")}</ol>
    </div>`,
    `<div class="ed">
      <span class="eyebrow">Practice along</span>
      <h2>Guided videos</h2>
      <div class="vids">
        ${(media.videos || []).map(([title, vid, channel, length, views], i) => `
          <a class="vid" href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener noreferrer">
            <em>${two(i + 1)}</em>
            <strong>${esc(title)}<small>${esc(channel)} · ${esc(length)} · ${esc(views)} views</small></strong>
            <span class="play"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5.5v13l10-6.5z" fill="currentColor"/></svg></span>
          </a>`).join("")}
      </div>
      <p class="note">Opens on YouTube.</p>
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

  // "#/meditations/<id>/practice" opens straight on How to practice
  const start = Math.max(0, STEPS.findIndex((s) => s.toLowerCase().startsWith(section || "history")));
  stepper(view.querySelector(".med"), slides, STEPS, { start });
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
  slide.addEventListener("pointerdown", (e) => { if (!e.target.closest("a, button, .dates")) sx = e.clientX; });
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
    if (e.target.closest?.("input, textarea, canvas")) return;
    if (e.key === "ArrowRight") go(step + 1);
    if (e.key === "ArrowLeft") go(step - 1);
  };
  addEventListener("keydown", onKey);

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
  box.setAttribute("aria-label", img.alt);
  box.innerHTML = `
    <button class="lb-close" aria-label="Close">×</button>
    <img src="${esc(img.src)}" alt="${esc(img.alt)}" />
    <p>${esc(plate.querySelector("figcaption").firstChild.textContent)}<small>${esc(plate.querySelector("figcaption small").textContent)}</small> <a href="${esc(plate.querySelector("a").href)}" target="_blank" rel="noopener noreferrer">View source ↗</a></p>`;
  const close = () => {
    box.classList.add("out");
    setTimeout(() => box.remove(), 300);
    removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();
  box.addEventListener("click", (e) => { if (!e.target.closest("a")) close(); });
  addEventListener("keydown", onKey);
  document.body.append(box);
  box.querySelector(".lb-close").focus();
}

// ---------- Chakras ----------

const CHAKRA_STEPS = ["What it is", "Signs of a block", "In balance", "How to unblock", "Meditations"];
let chakraStep = 0;

function renderChakras(id) {
  const c = chakraById[id] || chakraById.heart;
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
        <nav class="chakra-list sr-only" aria-label="Chakras">
          ${CHAKRAS.map((k) => `<a href="#/chakras/${k.id}" class="${k.id === c.id ? "on" : ""}" style="--k:${k.color}" title="${k.name}"><i></i><span>${k.name}</span></a>`).join("")}
        </nav>
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
  const plan = GUIDE[level];
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

function route() {
  const [, page = "", id, sub] = location.hash.replace(/^#/, "").split("/");
  document.querySelectorAll("[data-nav]").forEach((a) =>
    a.classList.toggle("on", a.dataset.nav === (page || "home"))
  );
  // a remembered "back" only applies to the meditation page opened from it
  if (page !== "meditations" || !id) {
    if (!["guide", "chakras"].includes(page)) backTo = null;
  }
  if (page === "meditations") id ? renderMeditation(id, sub) : renderLibrary();
  else if (page === "chakras") renderChakras(id);
  else if (page === "guide") renderGuide(id);
  else renderHome();
  if (page !== "chakras" || !id) window.scrollTo(0, 0);
}

// Background scene: green hills or calm water, remembered between visits.
function setScene(scene) {
  document.body.dataset.scene = scene;
  document.documentElement.dataset.scene = scene;
  document.querySelectorAll("button[data-scene]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.scene === scene)));
  try { localStorage.setItem("stillpoint-scene", scene); } catch {}
}
let savedScene = "hills";
try { const v = localStorage.getItem("stillpoint-scene"); if (["water", "sunrise"].includes(v)) savedScene = v; } catch {}
setScene(savedScene);
document.querySelectorAll("button[data-scene]").forEach((b) => b.addEventListener("click", () => setScene(b.dataset.scene)));

// Small screens: one Menu button opens a full-screen sheet.
const menuBtn = document.querySelector(".menu-btn");
const menuSheet = document.getElementById("menu-sheet");
function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
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
menuSheet.querySelector(".menu-close").addEventListener("click", () => { setMenu(false); menuBtn.focus(); });
menuSheet.querySelectorAll(".menu-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuSheet.hidden) { setMenu(false); menuBtn.focus(); } });

// The chakras page sizes itself to the window below the nav.
const setNavHeight = () =>
  document.documentElement.style.setProperty("--nav-h", `${document.querySelector(".nav").offsetHeight}px`);
setNavHeight();
window.addEventListener("resize", setNavHeight);

window.addEventListener("hashchange", route);
route();
