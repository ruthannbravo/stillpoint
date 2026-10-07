// Helper for docs/frames.html: builds README/portfolio image frames. Run it locally;
// the live site's security headers stop it from framing the app when hosted.
  const params = new URLSearchParams(location.search);
  const v = params.get("v") || "hero";
  const bg = params.get("bg");
  // show the site's water scene inside every frame
  if (bg) { try { localStorage.setItem("stillpoint-scene", bg); localStorage.setItem("stillpoint-controls", "0"); } catch {} }
  const app = "../index.html";
  const phone = (hash, style = "") => `<div class="phone" style="${style}"><div class="screen"><iframe src="${app}${hash}" scrolling="no"></iframe></div></div>`;
  const sizes = { pair: [1920, 1080], hero: [1880, 1000], pages: [1880, 1240], body: [1880, 1180], phones: [1880, 1080] };
  const [w, h] = sizes[v];
  document.body.style.setProperty("--w", w + "px");
  document.body.style.setProperty("--h", h + "px");
  const c = document.getElementById("c");
  document.querySelector(".stage").classList.add(v);
  if (bg) document.querySelector(".stage").classList.add(bg);
  // finish every fade-in instantly inside the frames so captures are never mid-animation
  const settle = (f) => { try { const st = f.contentDocument.createElement("style"); st.textContent = "*,*::before,*::after{animation-delay:0s!important;animation-duration:.001s!important;transition:none!important}"; f.contentDocument.head.append(st); } catch {} };
  new MutationObserver(() => document.querySelectorAll("iframe").forEach((f) => { if (!f.dataset.s) { f.dataset.s = 1; f.addEventListener("load", () => settle(f)); } })).observe(document.body, { childList: true, subtree: true });
  const desk = (hash) => `<div class="deskframe"><iframe src="${app}${hash}" scrolling="no"></iframe></div>`;

  if (v === "pair") c.innerHTML = `
    ${desk(params.get("d"))}
    ${phone(params.get("p"))}
    <div class="label cap"><b>${params.get("t") || ""}</b></div>`;

  if (v === "hero") c.innerHTML = `
    <div class="text">
      <div class="eyebrow">Meditation &amp; chakras</div>
      <h1>Stillpoint</h1>
      <p>Describe what you're carrying. Find a meditation, and see where it may be sitting in your body.</p>
      <div class="pills"><span>3D glass body</span><span>14 practices</span><span>4-week guide</span></div>
    </div>
    <div class="shot desk"><img src="raw/chakra.png" alt=""></div>
    ${phone("#/")}`;

  if (v === "pages") c.innerHTML = `
    <div class="grid">
      ${[["find", "01", "Find", "describe a feeling"], ["library", "02", "Meditations", "fourteen practices"], ["meditation", "03", "A practice", "history, uses, steps, videos"], ["guide", "04", "Guide", "a four-week plan"]]
        .map(([img, n, name, sub]) => `<figure style="margin:0"><div class="shot"><img src="raw/${img}.png" alt=""></div><div class="label">${n} &nbsp; <b>${name}</b> &nbsp;·&nbsp; ${sub}</div></figure>`).join("")}
    </div>`;

  if (v === "body") c.innerHTML = `
    <div class="shot desk"><img src="raw/chakra.png" alt=""></div>
    ${phone("#/chakras/throat")}
    <div class="notes">
      <div><b>Glass, not skin</b>A Fresnel shader lights only the edges, drawn in two passes so arms and torso read as one clean shell.</div>
      <div><b>Breathing lights</b>Seven chakras pulse softly along the spine, and the camera glides to whichever one you open.</div>
      <div><b>Yours to turn</b>Drag, pinch, scroll or tap. On phones, vertical swipes still scroll the page.</div>
    </div>`;

  if (v === "phones" && bg) document.body.style.setProperty("--h", "1080px"), document.body.style.setProperty("--w", "1920px");
  if (v === "phones") c.innerHTML = `
    <div class="row">
      ${[["#/", "Find"], ["#/chakras/heart", "Chakras"], ["#/guide/beginner", "Guide"]]
        .map(([hash, cap]) => `<div>${phone(hash, "transform:scale(1)")}<div class="label cap"><b>${cap}</b></div></div>`).join("")}
    </div>`;
