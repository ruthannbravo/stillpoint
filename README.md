# Stillpoint

**A calm, interactive guide to meditation and the chakras.**
Live at **[stillpoint.annbravo.com](https://stillpoint.annbravo.com)**

Describe how you feel in your own words, and Stillpoint suggests a meditation and shows where that feeling may be sitting in your body, on a glass-like 3D figure you can turn, zoom and tap.

---

## A vibe-coded design project

Stillpoint was **vibe coded**: built entirely through conversation with AI coding agents (mainly Claude Code, with some help from Codex), with me directing the vision instead of writing code line by line.

The point of the project was not the topic. Meditation is simple and well understood. The point was **design**: how far can you push the look, feel and interaction of a website about something simple, when the building is delegated and your energy goes into taste?

The whole process was a conversation of small, opinionated requests:

- *"I really hate the design."* The first version was beige and flat. I shared two reference images (a glowing x-ray body on pink, and a dreamy blue-to-yellow gradient) and asked for something closer to them.
- *"Less skeleton. I want to move the body left, right, up and down."* This became a rotatable 3D figure.
- *"The hands are too far from the body, I want the person to look relaxed."* The arms were re-posed in code.
- *"I don't want the text in a box. Make it editorial."* The boxes came out, replaced by big type, hairlines and slide-in sections.
- *"I love Soft Veil."* I picked a readability treatment from three side-by-side mocks.
- *"Take this offline."* Every font, image and library is now bundled with the site.

Every visual choice (fonts, backgrounds, spacing, animation, wording) came from iterating like this: look at it, react, refine.

## What's inside

| Page | What it does |
|---|---|
| **Find** | A search box: *"What are you carrying today?"* Type a feeling ("I can't stop overthinking", "I hate myself", "candle gazing") and it matches you to meditations, then lights up the chakras that may be involved on the 3D body. |
| **Meditations** | 14 practices from mindfulness to qigong. Each has a timeline you swipe through: **History** (real historical images and key dates) → **Used for** → **How to practice** → **Guided videos** (hand-picked YouTube sessions). |
| **Chakras** | The 3D body beside a stepper for each of the seven chakras: what it is, signs of a block, signs of balance, how to unblock it, and meditations that help. |
| **Guide** | Pick Beginner, Intermediate or Advanced and get a gentle four-week plan that links straight to each practice. |

Small touches: hills / water / sunrise backgrounds, a slow word-by-word landing animation, a full-screen menu on phones, and a support note above the results. If what you type sounds like thoughts of suicide or self-harm, said directly ("I want to die") or indirectly ("I don't want to be here anymore"), it shows the 988 crisis line. Heavy but less acute words ("I hate myself", "hopeless") get a gentler note with the same number. It is a word list, not a screening tool: it's set to show the note too often rather than miss someone, and it can still miss phrasing it hasn't seen. The meditations are always shown too.

---

## How the interactive body works

The chakra figure is the centrepiece, so here's how it's built (see [`body3d.js`](body3d.js)).

### 1. The model
The body comes from **MakeHuman**, an open-source human-modelling tool whose base meshes are released under CC0 (free for any use). A small Python script ([`scripts/build_anatomy.py`](scripts/build_anatomy.py)) blends MakeHuman's female and male shape targets, smooths the mesh once, and exports it as plain JSON ([`assets/anatomy.json`](assets/anatomy.json)): vertex positions, triangles, and the original quad edges used for the optional contour lines.

### 2. A relaxed pose, in code
MakeHuman stands in an A-pose: arms out, elbows bent forward. Instead of rigging a skeleton, `relaxArms()` re-poses the arms directly on the vertices when the model loads:
1. Each vertex gets a weight for how much it belongs to the arm, based on where it sits relative to the armpit and the side of the torso, with smooth falloff so the skin blends.
2. The forearm is rotated around the elbow so it hangs in line with the upper arm.
3. The whole arm is swung down around the shoulder by about 30°, so the hands rest beside the thighs.

### 3. The glass look
The body uses a custom **Fresnel shader**: surfaces facing you are almost invisible, while edges curving away glow white, like light catching the rim of glass. A soft highlight from above adds depth.

The figure would normally show doubled outlines wherever an arm crosses the torso. To avoid that, the mesh is drawn **twice**:
- **First pass:** writes depth only, so it records where the front surface is without drawing anything.
- **Second pass:** draws the glass, but only on that front-most surface.

The result reads as one clean shell instead of overlapping layers.

### 4. The chakras
Each chakra is a stack of glowing **sprites** (a soft aura, a coloured glow, a bright core and a dotted ring for the selected one), placed along the spine at the right height and always drawn on top of the body. They breathe with a gentle sine-wave pulse. Highlighted chakras grow and get a larger aura, and hovering makes them bigger still. Each has an invisible hit sphere, so a **raycaster** can tell which one you tapped.

### 5. Interaction
- **Drag** to rotate, with easing and inertia. On phones, vertical swipes scroll the page instead, so only sideways drags turn the body.
- **Scroll or pinch** to zoom smoothly.
- **Tap** a chakra to open it.
- A tucked-away **Controls** button reveals female/male, contour lines, zoom and arrow buttons for people who prefer clicking.

One WebGL renderer is shared across the whole site, and its canvas simply moves between pages, so the body never reloads.

---

## How the rest was built

- **No framework, no build step.** Plain HTML, CSS and JavaScript ([`index.html`](index.html), [`styles.css`](styles.css), [`app.js`](app.js), [`data.js`](data.js)), with a tiny hash router for the pages.
- **Content as data.** Every meditation, chakra, guide plan, keyword and video lives in [`data.js`](data.js), so the site can grow without touching layout code.
- **Matching without AI.** The search scores your words against feeling keywords (anxiety, grief, anger…) and practice keywords (candle, breath, tai chi…). It runs entirely in the browser, and nothing you type is sent anywhere.
- **Design system.** *Instrument Serif* for headlines, *DM Sans* for reading, frosted-glass panels, dotted organic "bubbles", and an edge-to-edge timeline component reused across meditations, chakras and the guide.
- **Offline and secure.** All assets are local. The site sets a strict Content-Security-Policy and other security headers ([`vercel.json`](vercel.json)), and has no keys, accounts or tracking.
- **Hosting.** Deployed on Vercel.

## Run it locally

```bash
python3 -m http.server 5187
```

Then open http://localhost:5187.

---

## Credits

- **3D body:** MakeHuman base mesh, CC0. See [`assets/ATTRIBUTION.md`](assets/ATTRIBUTION.md).
- **3D engine:** [three.js](https://threejs.org) r128, MIT.
- **Fonts:** Instrument Serif and DM Sans, SIL Open Font License.
- **Backgrounds:** photographs from [Unsplash](https://unsplash.com), Unsplash License.
- **Historical images:** Wikimedia Commons (public domain, CC0, CC BY and CC BY-SA). Each image's author and licence are credited on the site and in [`data.js`](data.js).
- **Guided videos:** links to the creators' own YouTube channels. No videos are hosted here.

*Chakras are a traditional framework from yogic and tantric practice, not a medical diagnosis. Meditation supports wellbeing but isn't a substitute for professional care.*
