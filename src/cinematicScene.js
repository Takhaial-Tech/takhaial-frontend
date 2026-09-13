/* The opening cinematic, rendered live instead of replayed from a file.
 *
 * This is takhaial-ai-motion/cinematic/scene.js — the scene the 1536x864 MP4 was
 * baked from — running in the page. Two differences from the offline source:
 *
 *   1. No GSAP. The timeline only drove two linear rotations and a DOM legend;
 *      everything else in the original renderFrame() was already a pure function
 *      of t, so t comes straight from the clock.
 *   2. Framing is responsive. The baked film has one 16:9 composition that the
 *      hero shader cover-crops, which eats the weave on tall screens and the top
 *      and bottom on wide ones. Here the camera is fitted to the scene's real
 *      extents and the three masses reflow by aspect, so nothing is ever cut.
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

export function createCinematicScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#071323");
  scene.fog = new THREE.FogExp2("#071323", 0.022);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  const target = new THREE.WebGLRenderTarget(2, 2, {
    depthBuffer: true,
    stencilBuffer: false,
  });
  /* Three writes into an ordinary render target in linear space whatever the
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
  const glow = track(new THREE.MeshBasicMaterial({ color: "#76acff" }));

  const world = new THREE.Group();
  scene.add(world);
  const mesh = (geometry, material, parent = world) => {
    const object = new THREE.Mesh(track(geometry), material);
    parent.add(object);
    return object;
  };
  const curve = (points) => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const pipe = (points, radius, material, parent = world) => {
    const path = curve(points);
    return { path, mesh: mesh(new THREE.TubeGeometry(path, 128, radius, 8, false), material, parent) };
  };

  /* The woven information ribbon. */
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
    pipe(pts, band === 0 ? 0.025 : 0.068, band === 0 ? silver : blue, weave).mesh.rotation.z = band * 0.007;
  }

  /* Paired wings — the motif that has to survive the narrowest viewport. */
  const crown = new THREE.Group();
  world.add(crown);
  for (const side of [-1, 1])
    for (let ring = 0; ring < 7; ring++) {
      const pts = [];
      for (let j = 0; j <= 128; j++) {
        const a = (j / 128) * TAU,
          r = 1 - ring * 0.085;
        pts.push([side * (0.3 + Math.cos(a) * 0.53 * r + 0.22 * Math.sin(a)), Math.sin(a) * 0.87 * r, 0.28 * Math.cos(a) + ring * 0.045]);
      }
      pipe(pts, 0.027, ring === 0 ? silver : blue, crown);
    }
  const crownSeed = mesh(new THREE.IcosahedronGeometry(0.13, 2), glow, crown);

  /* Seventy-two objects migrating from scatter into a lattice. */
  const field = new THREE.Group();
  world.add(field);
  const cubes = [];
  const cubeGeo = track(new RoundedBoxGeometry(0.36, 0.36, 0.36, 3, 0.055));
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

  /* Flow rails and their travelling signals. */
  const rails = new THREE.Group();
  world.add(rails);
  const flows = [];
  for (let i = 0; i < 7; i++) {
    const offset = (i - 3) * 0.11;
    const p = pipe(
      [[-5.5, -1.3, offset], [-4, -2.4, offset], [0, -2.7 + offset, 0.45], [4, -2.05, offset], [5.2, -0.6, offset]],
      0.018,
      blue,
      rails,
    );
    const dots = [];
    for (let j = 0; j < 3; j++) dots.push(mesh(new THREE.SphereGeometry(0.044, 12, 8), glow, rails));
    flows.push({ path: p.path, dots, index: i });
  }

  /* Physical endpoints. */
  function endpoint(width, height, x, y) {
    const g = new THREE.Group();
    g.position.set(x, y, 0.8);
    world.add(g);
    const box = track(new RoundedBoxGeometry(width, height, 0.14, 4, 0.09));
    g.add(new THREE.Mesh(box, darkMaterial));
    const edges = track(new THREE.EdgesGeometry(box, 30));
    g.add(new THREE.LineSegments(edges, track(new THREE.LineBasicMaterial({ color: "#76acff", transparent: true, opacity: 0.65 }))));
    const face = mesh(new THREE.PlaneGeometry(width - 0.2, height - 0.2), track(new THREE.MeshBasicMaterial({ color: "#0753c7", transparent: true, opacity: 0.24 })), g);
    face.position.z = 0.076;
    for (let i = 0; i < 3; i++) {
      const bar = mesh(new RoundedBoxGeometry((width - 0.42) * (i === 0 ? 0.76 : 1), 0.045, 0.022, 2, 0.012), i === 0 ? silver : blue, g);
      bar.position.set(i === 0 ? -0.12 : 0, height * 0.2 - i * 0.17, 0.1);
    }
    return g;
  }
  const web = endpoint(1.28, 0.9, -0.93, -2.58),
    app = endpoint(0.51, 0.97, 1.03, -2.58);

  /* Deterministic depth particles. */
  const starGeoSmall = track(new THREE.SphereGeometry(0.012, 8, 6));
  const starGeoLarge = track(new THREE.SphereGeometry(0.025, 8, 6));
  const stars = [];
  for (let i = 0; i < 65; i++) {
    const object = new THREE.Mesh(i % 7 === 0 ? starGeoLarge : starGeoSmall, glow);
    const x = Math.sin(i * 12.31) * 10,
      y = Math.cos(i * 8.91) * 5,
      z = -4 - Math.abs(Math.sin(i * 1.31)) * 6;
    object.position.set(x, y, z);
    world.add(object);
    stars.push({ obj: object, x, y, z });
  }

  /* ---- responsive framing ------------------------------------------------ */
  let layout = { endY: -2.58 };
  let distance = 16.4;

  function applyLayout(aspect) {
    /* 0 at a phone, 1 at 16:9, beyond 1 on ultrawide so the masses keep
       spreading rather than pooling in the middle of a very wide window. In
       portrait the composition opens diagonally, leaving the centre band for
       the headline — the same space the baked film reserved with a vignette. */
    const t = clamp((aspect - 0.55) / (1.78 - 0.55), 0, 1.35);
    const l = {
      weaveX: lerp(-1.45, -5.6, t),
      weaveY: lerp(2.25, 0.05, t),
      weaveS: lerp(0.52, 1.18, t),
      fieldX: lerp(1.4, 5.05, t),
      fieldY: lerp(-3.15, 0.4, t),
      fieldS: lerp(0.52, 1, t),
      crownY: lerp(4.15, 3.15, t),
      railsY: lerp(-2.1, 0, t),
      railsS: lerp(0.42, 1, t),
      endY: lerp(-4.45, -2.58, t),
    };
    layout = l;
    weave.position.set(l.weaveX, l.weaveY, 0);
    weave.scale.setScalar(l.weaveS);
    field.position.set(l.fieldX, l.fieldY, 0);
    field.scale.setScalar(l.fieldS);
    crown.position.set(0, l.crownY, 0.5);
    crown.scale.setScalar(0.92);
    rails.position.y = l.railsY;
    rails.scale.setScalar(l.railsS);
    web.position.x = lerp(-0.55, -0.93, t);
    app.position.x = lerp(0.62, 1.03, t);
    return l;
  }

  /* The hero shader was authored against a 16:9 film and cover-crops it, so the
     target stays 16:9 and every measurement downstream keeps working. What
     changes is that the scene now composes for the part of that frame the
     visitor will actually see: `visibleAspect` is the shape of the hero's media
     rectangle, and the camera is fitted so the whole composition lands inside
     it. The crop then removes only empty space. */
  const FILM_ASPECT = 16 / 9;
  const MAX_TARGET = 4096;

  function setSize(pixelWidth, pixelHeight, visibleAspect) {
    const vA = Math.max(0.3, visibleAspect || pixelWidth / pixelHeight);
    /* Size the film so the visible slice of it is at least as dense as the
       canvas: a tall viewport only shows a vertical band of the 16:9 frame. */
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
    const halfY = Math.max(l.crownY + 1.15, Math.abs(l.endY) + 0.75);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    /* Half-extents the visitor can see at unit distance, in film space. */
    const seenX = vA < FILM_ASPECT ? tan * vA : tan * FILM_ASPECT;
    const seenY = vA < FILM_ASPECT ? tan : (tan * FILM_ASPECT) / vA;
    distance = Math.max(halfX / seenX, halfY / seenY) * 1.04;
    camera.updateProjectionMatrix();
  }

  function advance(t) {
    const phase = (t / D) * TAU,
      morph = ease((t - 5) / 5) * (1 - ease((t - 21) / 5.5));
    weave.rotation.set(0.2 + Math.sin(phase) * 0.15, 0.4 + TAU * (t / D), -0.16 + Math.sin(phase) * 0.1);
    crown.rotation.set(0, TAU * (t / D), Math.sin(phase) * 0.055);
    crownSeed.scale.setScalar(1 + 0.12 * Math.sin(phase * 3));
    field.rotation.set(0.14 + Math.sin(phase) * 0.12, 0.2 + Math.sin(phase) * 0.36, Math.sin(phase) * 0.07);
    for (const { obj, initial, target: settled, index } of cubes) {
      const settle = ease((morph - 0.025 * (index % 6)) / 0.85);
      obj.position.lerpVectors(initial, settled, settle);
      obj.position.y += Math.sin(phase + index * 0.37) * 0.065 * (1 - settle);
      obj.rotation.set((1 - settle) * (0.2 + Math.sin(phase + index) * 0.25), (1 - settle) * (index * 0.17 + phase), 0);
    }
    for (const { path, dots, index } of flows)
      for (let j = 0; j < dots.length; j++) {
        /* Held off the exact endpoint: getPointAt(1) indexes one control point
           past the end and throws. The baked render only ever sampled discrete
           frame times, so it never landed there; live playback does. */
        const u = clamp(((t / D) * 3 + j / 3 + index * 0.071) % 1, 0, 0.9999);
        dots[j].position.copy(path.getPointAt(u));
      }
    web.position.y = layout.endY + Math.sin(phase) * 0.09;
    app.position.y = layout.endY - Math.sin(phase) * 0.07;
    web.rotation.set(-0.08, 0.25 + Math.sin(phase) * 0.15, 0.015);
    app.rotation.set(0.02, -0.3 + Math.sin(phase) * 0.12, -0.02);
    for (const { obj, x, y, z } of stars) obj.position.set(x + Math.sin(phase) * 0.15, y + Math.cos(phase) * 0.08, z);
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
