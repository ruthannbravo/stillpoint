// Translucent 3D figure with glowing chakras. One renderer is shared across
// views; mount() moves its canvas into whichever stage is on screen.

const Body3D = (() => {
  const CHAKRA_Y = {
    crown: 2.02, "third-eye": 1.68, throat: 1.17, heart: 0.82,
    "solar-plexus": 0.32, sacral: 0.0, root: -0.33,
  };

  let renderer, scene, camera, pivot, nodes = {}, hits = [];
  let host, resizeObs, figure, ok = true;
  let bodyType = "female";
  try { bodyType = localStorage.getItem("stillpoint-body") === "male" ? "male" : "female"; } catch {}
  let zoom = 1, tZoom = 1, baseZ = 10.2;
  const ZOOM_MIN = 0.8, ZOOM_MAX = 2.6;
  const pointers = new Map();
  let pinchDist = 0;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state = { highlight: [], selected: null, onPick: null };

  let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0, vYaw = 0, vPitch = 0;
  let dragging = false, touched = false, down = null, last = null, hovered = null;
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  const clock = new THREE.Clock();

  function texture(draw) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    draw(c.getContext("2d"));
    const t = new THREE.CanvasTexture(c);
    return t;
  }
  const glowTex = () =>
    texture((g) => {
      const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      r.addColorStop(0, "rgba(255,255,255,1)");
      r.addColorStop(0.22, "rgba(255,255,255,.75)");
      r.addColorStop(0.5, "rgba(255,255,255,.22)");
      r.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, 256, 256);
    });
  const ringTex = () =>
    texture((g) => {
      g.strokeStyle = "rgba(255,255,255,.95)";
      g.lineWidth = 3;
      g.setLineDash([3, 7]);
      g.beginPath();
      g.arc(128, 128, 120, 0, Math.PI * 2);
      g.stroke();
    });

  const GLASS_VERT = `
    varying vec3 vN; varying vec3 vV;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal);
      vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`;
  const GLASS_FRAG = `
    uniform vec3 uTint; uniform vec3 uRim;
    varying vec3 vN; varying vec3 vV;
    void main() {
      vec3 n = normalize(vN), v = normalize(vV);
      float f = pow(1.0 - abs(dot(n, v)), 2.4);
      vec3 l = normalize(vec3(-0.45, 0.65, 0.6));
      float spec = pow(max(dot(reflect(-l, n), v), 0.0), 28.0);
      float sheen = smoothstep(0.2, 1.0, n.y) * 0.08;
      vec3 col = mix(uTint, uRim, f) + spec * 0.7;
      gl_FragColor = vec4(col, 0.07 + sheen + f * 0.62 + spec * 0.4);
    }`;

  let anatomyPromise, anatomyData;
  const modelCache = new Map();
  let surface = "sculpture";

  function status(message, retry = false) {
    if (!host) return;
    host.querySelector(".model-status")?.remove();
    if (!message) return;
    const box = document.createElement("div");
    box.className = "model-status"; box.setAttribute("role", "status");
    box.textContent = message;
    if (retry) {
      const button = document.createElement("button");
      button.textContent = "Try again";
      button.addEventListener("click", loadAnatomy);
      box.append(button);
    }
    host.append(box);
  }

  function loadAnatomy() {
    if (anatomyData) return;
    status("Loading anatomical model…");
    if (!anatomyPromise) {
      anatomyPromise = fetch("assets/anatomy.json").then(response => {
        if (!response.ok) throw new Error("Body asset unavailable");
        return response.json();
      }).then(data => {
        for (const type of ["female", "male"]) {
          const model = data[type];
          if (!model || !Array.isArray(model.positions) || model.positions.length % 3 ||
              !model.positions.length || !Array.isArray(model.indices) || !Array.isArray(model.edges)) {
            throw new Error("Invalid body asset");
          }
        }
        anatomyData = data;
        buildFigure(); status("");
      }).catch(error => {
        console.error("Stillpoint model:", error);
        anatomyData = null;
        anatomyPromise = null;
        status("The body couldn't load. The chakra list is still available.", true);
      });
    }
  }

  // The source mesh stands in an A-pose with elbows bent forward. Relax it:
  // first let the forearm hang in line with the upper arm, then swing the
  // whole arm down around the shoulder so the hands rest by the thighs.
  // Armpit and elbow vertices blend between poses so the skin stays smooth.
  function relaxArms(src, type) {
    const out = Float32Array.from(src);
    const n = out.length / 3;
    const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const J = new THREE.Vector3(0.38, 1.02, 0.05);

    const w = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const ax = Math.abs(out[i * 3]), y = out[i * 3 + 1];
      const beyondCut = (ax - 0.4) * 0.86 - (y - 0.77) * 0.51;
      const outsideTorso = ax - (0.4 + Math.max(0, 0.77 - y) * 0.5);
      w[i] = ss(-0.03, 0.14, beyondCut) * ss(-0.05, 0.05, outsideTorso);
    }
    const centroid = (y0) => {
      const c = new THREE.Vector3(); let k = 0;
      for (let i = 0; i < n; i++) {
        if (w[i] < 0.95 || Math.abs(out[i * 3 + 1] - y0) > 0.04) continue;
        c.x += Math.abs(out[i * 3]); c.y += out[i * 3 + 1]; c.z += out[i * 3 + 2]; k++;
      }
      return k ? c.divideScalar(k) : null;
    };
    const E = centroid(0.47), W = centroid(0.12);

    const P = new THREE.Vector3(), q = new THREE.Quaternion(), id = new THREE.Quaternion();
    if (E && W) {
      const up = E.clone().sub(J).normalize();
      const fore = W.clone().sub(E).normalize();
      const target = up.clone().lerp(fore, 0.12).normalize();
      const bend = new THREE.Quaternion().setFromUnitVectors(fore, target);
      for (let i = 0; i < n; i++) {
        if (!w[i]) continue;
        const sx = Math.sign(out[i * 3]) || 1;
        P.set(Math.abs(out[i * 3]), out[i * 3 + 1], out[i * 3 + 2]).sub(E);
        const k = w[i] * ss(-0.08, 0.08, P.dot(up));
        if (!k) continue;
        q.copy(id).slerp(bend, k);
        P.applyQuaternion(q).add(E);
        out[i * 3] = sx * P.x; out[i * 3 + 1] = P.y; out[i * 3 + 2] = P.z;
      }
    }

    const angle = (type === "male" ? 33 : 30) * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      if (!w[i]) continue;
      const x = out[i * 3], y = out[i * 3 + 1];
      const th = -angle * w[i], c = Math.cos(th), sn = Math.sin(th);
      const rx = Math.abs(x) - J.x, ry = y - J.y;
      out[i * 3] = Math.sign(x) * (J.x + rx * c - ry * sn);
      out[i * 3 + 1] = J.y + rx * sn + ry * c;
    }
    return out;
  }

  function buildFigure() {
    if (!anatomyData || !figure) return;
    figure.clear();
    let model = modelCache.get(bodyType);
    if (!model) {
      const data = anatomyData[bodyType];
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(relaxArms(data.positions, bodyType), 3));
      geometry.setIndex(data.indices); geometry.computeVertexNormals();
      // Glass body: a depth-only pass first so only the outermost surface
      // glows (no arm-behind-torso doubling), then a fresnel glass shell.
      const offset = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
      const depth = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ colorWrite: false, ...offset }));
      depth.renderOrder = 0;
      const material = new THREE.ShaderMaterial({
        uniforms: { uTint: { value: new THREE.Color("#e8f4f2") }, uRim: { value: new THREE.Color("#ffffff") } },
        vertexShader: GLASS_VERT,
        fragmentShader: GLASS_FRAG,
        transparent: true,
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        ...offset,
      });
      const body = new THREE.Mesh(geometry, material);
      body.renderOrder = 1;
      const linesGeometry = new THREE.BufferGeometry();
      linesGeometry.setAttribute("position", geometry.attributes.position);
      linesGeometry.setIndex(data.edges);
      const lines = new THREE.LineSegments(linesGeometry, new THREE.LineBasicMaterial({
        color: "#7bded1", transparent: true, opacity: 0.30, depthWrite: false,
      }));
      model = new THREE.Group(); model.add(depth, body, lines);
      lines.renderOrder = 2;
      model.userData = { body, lines };
      modelCache.set(bodyType, model);
    }
    figure.add(model);
    applySurface();
    renderer.domElement.setAttribute("aria-label", `${bodyType} anatomical 3D body. Drag or use arrow keys to rotate. Use the chakra list to select a chakra.`);
  }

  function applySurface() {
    const model = modelCache.get(bodyType);
    if (!model) return;
    const contour = surface === "contour";
    model.userData.body.material.uniforms.uTint.value.set(contour ? "#2a6f73" : "#e8f4f2");
    model.userData.lines.visible = contour;
  }

  function setSurface(value) {
    if (!["contour", "sculpture"].includes(value)) return;
    surface = value; applySurface();
  }

  function setBodyType(type) {
    if (!["female", "male"].includes(type)) return;
    bodyType = type;
    try { localStorage.setItem("stillpoint-body",type); } catch {}
    buildFigure();
  }

  function magnify(amount) {
    tZoom = clampZoom(tZoom * Math.exp(amount * 2));
  }

  const clampZoom = (z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));

  function onWheel(e) {
    e.preventDefault();
    // trackpad pinch arrives as ctrl+wheel with small deltas; mouse wheels send large ones
    const k = e.ctrlKey ? 0.012 : 0.0016;
    const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    tZoom = clampZoom(tZoom * Math.exp(-d * k));
  }

  function buildChakras(root) {
    const glowT = glowTex(), ringT = ringTex();
    const sprite = (map, color, opacity) =>
      new THREE.Sprite(new THREE.SpriteMaterial({ map, color, transparent: true, opacity, depthWrite: false, depthTest: false, toneMapped: false }));

    CHAKRAS.forEach((c, i) => {
      const g = new THREE.Group();
      g.position.set(0, CHAKRA_Y[c.id], 0.04);
      const col = new THREE.Color(c.color);
      const aura = sprite(glowT, col, 0);
      const glow = sprite(glowT, col, 0.9);
      const core = sprite(glowT, col.clone().lerp(new THREE.Color("#fff"), 0.4), 1);
      const ring = sprite(ringT, new THREE.Color("#fff"), 0);
      [aura, glow, core, ring].forEach((s) => (s.renderOrder = 10 + i));
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData.id = c.id;
      g.add(aura, glow, core, ring, hit);
      root.add(g);
      hits.push(hit);
      nodes[c.id] = { aura, glow, core, ring, i, s: 0.3, o: 0.9 };
    });
  }

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      ok = false;
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, -0.15, 9.4);
    camera.lookAt(0, -0.15, 0);

    pivot = new THREE.Group();
    pivot.position.y = -0.15;
    figure = new THREE.Group();
    figure.position.y = 0.15;
    pivot.add(figure);
    scene.add(pivot);

    const energy = new THREE.Group();
    energy.position.y = 0.15;
    pivot.add(energy);
    buildChakras(energy);
    scene.add(new THREE.HemisphereLight(0xe6fff6, 0x536275, 0.55));
    const key = new THREE.DirectionalLight(0xfff5df, 1.35);
    key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc1e4ff, 0.85);
    rim.position.set(3, 1, -3); scene.add(rim);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;

    const el = renderer.domElement;
    el.className = "body-canvas";
    el.tabIndex = 0;
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", `${bodyType} 3D body. Drag or use arrow keys to rotate. Use the chakra list to select a chakra.`);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", (e) => { pointers.delete(e.pointerId); dragging = false; down = null; vYaw = vPitch = 0; });
    el.addEventListener("pointerleave", () => setHover(null));
    el.addEventListener("keydown", (e) => {
      const step = { ArrowLeft: [-0.35, 0], ArrowRight: [0.35, 0], ArrowUp: [0, -0.2], ArrowDown: [0, 0.2] }[e.key];
      if (step) {
        e.preventDefault();
        nudge(...step);
      }
    });
    loop();
  }

  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    return ray.intersectObjects(hits)[0]?.object.userData.id || null;
  }

  function setHover(id) {
    hovered = id;
    renderer.domElement.style.cursor = id ? "pointer" : dragging ? "grabbing" : "grab";
  }

  const spread = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  function onDown(e) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      pinchDist = spread();
      dragging = false;
      down = null;
      vYaw = vPitch = 0;
      renderer.domElement.setPointerCapture(e.pointerId);
      return;
    }
    if (e.button !== 0 || dragging) return;
    vYaw = vPitch = 0;
    dragging = true;
    touched = true;
    down = last = { x: e.clientX, y: e.clientY };
    renderer.domElement.setPointerCapture(e.pointerId);
    setHover(null);
  }
  function onMove(e) {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const d = spread();
      if (pinchDist) tZoom = clampZoom(tZoom * (d / pinchDist));
      pinchDist = d;
      return;
    }
    if (!dragging) return setHover(pick(e));
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    last = { x: e.clientX, y: e.clientY };
    vYaw = dx * 0.011;
    // on touch screens vertical swipes scroll the page, so only mouse/pen tilt
    vPitch = e.pointerType === "touch" ? 0 : dy * 0.007;
    tYaw += vYaw;
    tPitch = Math.max(-0.6, Math.min(0.6, tPitch + vPitch));
  }
  function onUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (!dragging || !down) return;
    dragging = false;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    if (moved < 6) {
      vYaw = vPitch = 0;
      const id = pick(e);
      if (id && state.onPick) state.onPick(id);
    }
    setHover(pick(e));
  }

  function nudge(dy, dp) {
    touched = true;
    tYaw += dy;
    tPitch = Math.max(-0.6, Math.min(0.6, tPitch + dp));
  }
  function reset() {
    touched = true;
    tYaw = Math.round(tYaw / (Math.PI * 2)) * Math.PI * 2;
    tPitch = 0;
    vYaw = vPitch = 0;
    tZoom = 1;
  }

  function loop() {
    requestAnimationFrame(loop);
    if (!host || !renderer.domElement.isConnected) return;
    const t = clock.getElapsedTime();

    if (!dragging) {
      tYaw += vYaw;
      tPitch = Math.max(-0.6, Math.min(0.6, tPitch + vPitch));
      vYaw *= 0.92;
      vPitch *= 0.88;
      if (!touched && !reducedMotion) tYaw = Math.sin(t * 0.35) * 0.45;
    }
    yaw += (tYaw - yaw) * 0.1;
    pitch += (tPitch - pitch) * 0.1;
    pivot.rotation.set(pitch, yaw, 0);
    zoom += (tZoom - zoom) * 0.12;
    camera.position.z = baseZ / zoom;
    pivot.position.y = -0.15 + (reducedMotion ? 0 : Math.sin(t * 0.8) * 0.008);

    const any = state.highlight.length > 0;
    for (const [id, n] of Object.entries(nodes)) {
      const lit = state.highlight.includes(id);
      const sel = state.selected === id;
      const breathe = reducedMotion ? 0.5 : Math.sin(t * 1.6 + n.i) * 0.5 + 0.5;
      let s = lit ? 0.68 + breathe * 0.1 : 0.36;
      let o = lit ? 1 : any ? 0.72 : 0.95;
      if (hovered === id) { s *= 1.45; o = 1; }
      n.s += (s - n.s) * 0.12;
      n.o += (o - n.o) * 0.12;
      n.glow.scale.setScalar(n.s);
      n.glow.material.opacity = n.o * 0.95;
      n.core.scale.setScalar(n.s * 0.48);
      n.core.material.opacity = Math.min(1, n.o + 0.2);
      n.aura.scale.setScalar(lit ? 1.15 + breathe * 0.18 : 0.01);
      n.aura.material.opacity += ((lit ? 0.24 : 0) - n.aura.material.opacity) * 0.08;
      n.ring.scale.setScalar(0.62 + (sel ? breathe * 0.03 : 0));
      n.ring.material.opacity += ((sel ? 0.9 : 0) - n.ring.material.opacity) * 0.12;
    }
    renderer.render(scene, camera);
  }

  function size() {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the full arm span in frame on narrow stages
    baseZ = Math.max(10.2, 4.5 / (w / h));
    camera.position.z = baseZ / zoom;
    camera.updateProjectionMatrix();
  }

  function mount(el, opts) {
    if (!renderer && ok) init();
    state = { highlight: [], selected: null, onPick: null, ...opts };
    host = el;
    if (!ok) {
      status("Your browser cannot show the 3D body. The chakra list below still works.");
      el.querySelectorAll("button").forEach(button => { button.disabled = true; });
      return;
    }
    el.prepend(renderer.domElement);
    loadAnatomy();
    resizeObs?.disconnect();
    resizeObs = new ResizeObserver(size);
    resizeObs.observe(el);
    size();
  }

  function update(opts) {
    Object.assign(state, opts);
  }

  return { mount, update, nudge, reset, setBodyType, magnify, setSurface, getSurface: () => surface, getBodyType: () => bodyType };
})();
