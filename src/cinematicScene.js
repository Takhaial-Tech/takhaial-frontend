/* The opening cinematic, rendered live instead of replayed from a file.
 *
 * Descended from takhaial-ai-motion/cinematic/scene.js — the scene the 1536x864
 * MP4 was baked from — with four deliberate departures:
 *
 *   1. No GSAP. The original timeline only drove two linear rotations and a DOM
 *      legend; the rest of its renderFrame() was already a pure function of t.
 *   2. Responsive framing. The baked film has one 16:9 composition that the hero
 *      shader cover-crops. Here the camera is fitted to the scene's real extents
 *      and the masses reflow by aspect, so nothing is ever cut.
 *   3. The wing motif is the flat 2D brand mark, held upright and still, rather
 *      than a rotating cage of tubes.
 *   4. The flow rails are gone. Only their travelling lights remain, drawn as
 *      additive sprites with a tail that fades out behind each one.
 *
 * It draws into a render target that heroRenderer binds as uPacked, so the
 * existing scroll choreography, depth stack and decorative layers are untouched.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const CINEMATIC_DURATION = 26.5;
const D = CINEMATIC_DURATION,
  TAU = Math.PI * 2;
const lerp = THREE.MathUtils.lerp,
  clamp = THREE.MathUtils.clamp;
const ease = (x) => {
  x = clamp(x, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/* One soft round falloff, shared by every light in the scene. */
function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(190,220,255,0.85)");
  g.addColorStop(0.55, "rgba(118,172,255,0.28)");
  g.addColorStop(1, "rgba(118,172,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCinematicScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#071323");
  scene.fog = new THREE.FogExp2("#071323", 0.022);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  const target = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: true, stencilBuffer: false });
  /* Three renders into an ordinary render target in linear space whatever the
     texture claims, so this holds linear values and heroRenderer applies the
     sRGB transfer when it samples them. */
  target.texture.colorSpace = THREE.LinearSRGBColorSpace;
  target.texture.minFilter = THREE.LinearFilter;
  target.texture.magFilter = THREE.LinearFilter;
  target.texture.generateMipmaps = false;

  const disposables = new Set([target]);
  const track = (thing) => {
    disposables.add(thing);
    return thing;
  };

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.55;
  track(environment);
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight("#76acff", "#071323", 0.5));
  for (const [color, power, x, y, z] of [
    ["#c7d5ea", 65, -7, 7, 6],
    ["#0753c7", 85, 6, 4, 4],
    ["#76acff", 55, 0, -3, 5],
  ]) {
    const light = new THREE.PointLight(color, power, 35, 2);
    light.position.set(x, y, z);
    scene.add(light);
  }

  const blue = track(new THREE.MeshPhysicalMaterial({ color: "#0753c7", metalness: 0.9, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.16 }));
  const silver = track(new THREE.MeshStandardMaterial({ color: "#76acff", metalness: 0.92, roughness: 0.25 }));
  const darkMaterial = track(new THREE.MeshPhysicalMaterial({ color: "#10264a", metalness: 0.68, roughness: 0.2, clearcoat: 1 }));
  const glow = track(glowTexture());

  const world = new THREE.Group();
  scene.add(world);
  const mesh = (geometry, material, parent = world) => {
    const object = new THREE.Mesh(track(geometry), material);
    parent.add(object);
    return object;
  };
  const curve = (points) => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const spark = (size, opacity, parent = world) => {
    const sprite = new THREE.Sprite(track(new THREE.SpriteMaterial({
      map: glow, color: "#9fc8ff", transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })));
    sprite.scale.setScalar(size);
    parent.add(sprite);
    return sprite;
  };

  /* The woven information ribbon. Denser tubes than the baked film carried,
     because nothing is being squeezed into a 1536 px frame any more. */
  const weave = new THREE.Group();
  world.add(weave);
  for (let band = 0; band < 9; band++) {
    const pts = [];
    for (let j = 0; j <= 240; j++) {
      const a = (j / 240) * TAU,
        offset = (band - 4) * 0.085,
        r = 1.5 + 0.5 * Math.cos(3 * a) + offset;
      pts.push([Math.cos(2 * a) * r, Math.sin(2 * a) * r, 0.7 * Math.sin(3 * a) + offset * 1.7]);
    }
    const tube = new THREE.TubeGeometry(curve(pts), 192, band === 0 ? 0.025 : 0.068, 12, false);
    mesh(tube, band === 0 ? silver : blue, weave).rotation.z = band * 0.007;
  }

  /* The brand mark, flat and upright. It is the logo, so nothing lights it and
     nothing turns it — only a slow drift and a halo breathing behind it. */
  const logo = new THREE.Group();
  world.add(logo);
  const markTexture = track(new THREE.TextureLoader().load("/takhaial/brand/mark.png"));
  markTexture.colorSpace = THREE.SRGBColorSpace;
  markTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  markTexture.minFilter = THREE.LinearMipmapLinearFilter;
  const markMaterial = track(new THREE.MeshBasicMaterial({
    map: markTexture, transparent: true, depthWrite: false, toneMapped: false,
  }));
  const MARK_ASPECT = 1024 / 969;
  const mark = mesh(new THREE.PlaneGeometry(1.9 * MARK_ASPECT, 1.9), markMaterial, logo);
  const markHalo = spark(4.6, 0.2, logo);
  markHalo.position.z = -0.4;

  /* Seventy-two objects migrating from scatter into a lattice. */
  const field = new THREE.Group();
  world.add(field);
  const cubes = [];
  const cubeGeo = track(new RoundedBoxGeometry(0.36, 0.36, 0.36, 4, 0.055));
  for (let i = 0; i < 72; i++) {
    const angle = i * 2.3999632297,
      z = 1 - (2 * (i + 0.5)) / 72,
      r = Math.sqrt(1 - z * z);
    const initial = new THREE.Vector3(Math.cos(angle) * r * 2, Math.sin(angle) * r * 2, z * 1.6);
    const settled = new THREE.Vector3(((i % 6) - 2.5) * 0.52, ((Math.floor(i / 6) % 4) - 1.5) * 0.52, (Math.floor(i / 24) - 1) * 0.6);
    const object = new THREE.Mesh(cubeGeo, i % 11 === 0 ? silver : blue);
    object.position.copy(initial);
    field.add(object);
    cubes.push({ obj: object, initial, target: settled, index: i });
  }

  /* The flow. The rails themselves are gone; their paths survive only to carry
     lights, each trailing a short tail. */
  const rails = new THREE.Group();
  world.add(rails);
  const TAIL = 7;
  const flows = [];
  for (let i = 0; i < 7; i++) {
    const offset = (i - 3) * 0.11;
    const path = curve([[-5.5, -1.3, offset], [-4, -2.4, offset], [0, -2.7 + offset, 0.45], [4, -2.05, offset], [5.2, -0.6, offset]]);
    const lights = [];
    for (let head = 0; head < 2; head++)
      for (let t = 0; t < TAIL; t++) {
        const fade = 1 - t / TAIL;
        lights.push({
          sprite: spark(0.34 * (0.35 + 0.65 * fade * fade), 0.95 * fade * fade, rails),
          head,
          lag: t * 0.0075,
          fade,
        });
      }
    flows.push({ path, lights, index: i });
  }

  /* Physical endpoints, reduced to their frames. The inner bars and the tinted
     face were the clutter sitting under the headline. */
  function endpoint(width, height, x, y) {
    const g = new THREE.Group();
    g.position.set(x, y, 0.8);
    world.add(g);
    const box = track(new RoundedBoxGeometry(width, height, 0.14, 4, 0.09));
    g.add(new THREE.Mesh(box, darkMaterial));
    const edges = track(new THREE.EdgesGeometry(box, 30));
    g.add(new THREE.LineSegments(edges, track(new THREE.LineBasicMaterial({ color: "#76acff", transparent: true, opacity: 0.7 }))));
    return g;
  }
  const web = endpoint(1.28, 0.9, -0.93, -2.58),
    app = endpoint(0.51, 0.97, 1.03, -2.58);

  /* Deterministic depth particles, now twinkling rather than merely present. */
  const stars = [];
  for (let i = 0; i < 78; i++) {
    const base = i % 7 === 0 ? 0.16 : 0.08;
    const sprite = spark(base, 0.6);
    const x = Math.sin(i * 12.31) * 10,
      y = Math.cos(i * 8.91) * 5,
      z = -4 - Math.abs(Math.sin(i * 1.31)) * 6;
    sprite.position.set(x, y, z);
    stars.push({ obj: sprite, x, y, z, base, phase: i * 1.7, rate: 0.6 + (i % 5) * 0.22 });
  }

  /* ---- responsive framing ------------------------------------------------ */
  let layout = { endY: -2.58, logoY: 3.15 };
  let distance = 16.4;

  function applyLayout(aspect) {
    /* 0 at a phone, 1 at 16:9, beyond 1 on ultrawide so the masses keep
       spreading rather than pooling in the middle of a very wide window. In
       portrait the composition opens diagonally, leaving the centre band for
       the headline — the space the baked film reserved with a vignette. */
    const t = clamp((aspect - 0.55) / (1.78 - 0.55), 0, 1.35);
    const l = {
      weaveX: lerp(-1.45, -5.6, t),
      weaveY: lerp(2.25, 0.05, t),
      weaveS: lerp(0.52, 1.18, t),
      fieldX: lerp(1.4, 5.05, t),
      fieldY: lerp(-3.15, 0.4, t),
      fieldS: lerp(0.52, 1, t),
      logoY: lerp(4.15, 3.15, t),
      logoS: lerp(0.74, 1, t),
      railsY: lerp(-2.1, 0, t),
      railsS: lerp(0.42, 1, t),
      endY: lerp(-4.45, -2.58, t),
    };
    layout = l;
    weave.position.set(l.weaveX, l.weaveY, 0);
    weave.scale.setScalar(l.weaveS);
    field.position.set(l.fieldX, l.fieldY, 0);
    field.scale.setScalar(l.fieldS);
    logo.position.set(0, l.logoY, 0.5);
    logo.scale.setScalar(l.logoS);
    rails.position.y = l.railsY;
    rails.scale.setScalar(l.railsS);
    web.position.x = lerp(-0.55, -0.93, t);
    app.position.x = lerp(0.62, 1.03, t);
    return l;
  }

  const FILM_ASPECT = 16 / 9;
  const MAX_TARGET = 4096;

  /* The hero shader was authored against a 16:9 film and cover-crops it, so the
     target stays 16:9 and every measurement downstream keeps working. What
     changes is that the scene composes for the part of that frame the visitor
     will actually see. */
  function setSize(pixelWidth, pixelHeight, visibleAspect) {
    const vA = Math.max(0.3, visibleAspect || pixelWidth / pixelHeight);
    const coverage = vA < FILM_ASPECT ? vA / FILM_ASPECT : 1;
    let w = Math.min(MAX_TARGET, Math.max(64, Math.round(pixelWidth / coverage)));
    let h = Math.max(36, Math.round(w / FILM_ASPECT));
    if (h > MAX_TARGET) {
      h = MAX_TARGET;
      w = Math.round(h * FILM_ASPECT);
    }
    if (target.width !== w || target.height !== h) target.setSize(w, h);

    camera.aspect = FILM_ASPECT;
    const l = applyLayout(vA);
    const halfX = Math.max(Math.abs(l.weaveX) + 2.5 * l.weaveS, Math.abs(l.fieldX) + 1.45 * l.fieldS, 5.6 * l.railsS);
    const halfY = Math.max(l.logoY + 1.3 * l.logoS, Math.abs(l.endY) + 0.75);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const seenX = vA < FILM_ASPECT ? tan * vA : tan * FILM_ASPECT;
    const seenY = vA < FILM_ASPECT ? tan : (tan * FILM_ASPECT) / vA;
    distance = Math.max(halfX / seenX, halfY / seenY) * 1.04;
    camera.updateProjectionMatrix();
  }

  const cursor = new THREE.Vector3();

  function advance(t) {
    const phase = (t / D) * TAU,
      morph = ease((t - 5) / 5) * (1 - ease((t - 21) / 5.5));

    weave.rotation.set(0.2 + Math.sin(phase) * 0.15, 0.4 + TAU * (t / D), -0.16 + Math.sin(phase) * 0.1);

    /* The mark never turns. It drifts, and the halo breathes behind it. */
    logo.position.y = layout.logoY + Math.sin(phase * 2) * 0.085;
    mark.material.opacity = 0.96 + 0.04 * Math.sin(phase * 3);
    markHalo.material.opacity = 0.1 + 0.06 * Math.sin(phase * 3 + 0.9);
    markHalo.scale.setScalar(4.1 + 0.35 * Math.sin(phase * 3 + 0.9));

    field.rotation.set(0.14 + Math.sin(phase) * 0.12, 0.2 + Math.sin(phase) * 0.36, Math.sin(phase) * 0.07);
    for (const { obj, initial, target: settled, index } of cubes) {
      const settle = ease((morph - 0.025 * (index % 6)) / 0.85);
      obj.position.lerpVectors(initial, settled, settle);
      obj.position.y += Math.sin(phase + index * 0.37) * 0.065 * (1 - settle);
      obj.rotation.set((1 - settle) * (0.2 + Math.sin(phase + index) * 0.25), (1 - settle) * (index * 0.17 + phase), 0);
    }

    for (const { path, lights, index } of flows)
      for (const { sprite, head, lag, fade } of lights) {
        /* Held off the exact endpoint: getPointAt(1) indexes one control point
           past the end and throws. */
        const raw = ((t / D) * 3 + head / 2 + index * 0.071 - lag) % 1;
        const u = clamp((raw + 1) % 1, 0, 0.9999);
        path.getPointAt(u, cursor);
        sprite.position.copy(cursor);
        /* Lights rise as they set off and settle as they arrive, so nothing pops. */
        const edge = Math.min(1, Math.min(u, 1 - u) / 0.08);
        sprite.material.opacity = 0.95 * fade * fade * edge;
      }

    web.position.y = layout.endY + Math.sin(phase) * 0.09;
    app.position.y = layout.endY - Math.sin(phase) * 0.07;
    web.rotation.set(-0.08, 0.25 + Math.sin(phase) * 0.15, 0.015);
    app.rotation.set(0.02, -0.3 + Math.sin(phase) * 0.12, -0.02);

    for (const s of stars) {
      s.obj.position.set(s.x + Math.sin(phase) * 0.15, s.y + Math.cos(phase) * 0.08, s.z);
      const twinkle = 0.5 + 0.5 * Math.sin(phase * s.rate * 6 + s.phase);
      s.obj.material.opacity = 0.2 + 0.5 * twinkle;
      s.obj.scale.setScalar(s.base * (0.8 + 0.45 * twinkle));
    }

    camera.position.set(Math.sin(phase) * 0.3, Math.sin(phase) * 0.12, distance - Math.sin(phase) * 0.35);
    camera.lookAt(0, 0, 0);
  }

  function render(t) {
    advance(t);
    const previousTarget = renderer.getRenderTarget();
    const previousTone = renderer.toneMapping,
      previousExposure = renderer.toneMappingExposure;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(previousTarget);
    renderer.toneMapping = previousTone;
    renderer.toneMappingExposure = previousExposure;
  }

  return {
    texture: target.texture,
    duration: D,
    setSize,
    render,
    dispose() {
      disposables.forEach((thing) => thing.dispose?.());
      scene.clear();
    },
  };
}
