import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Studio values ported from the standalone Tackial robot viewer. The light-rig
// rotation is final and must not change without an explicit tuning request.
const FIXED_LIGHT_ROTATION = { yaw: 53, pitch: 44 };
const MATERIAL_ROUGHNESS = 0.36 * 1.5;
const MATERIAL_ENV_MAP_INTENSITY = 0.82;
const ROBOT_SIZE = 4.15;
// The canvas is rendered this much larger than the robot's visual box
// (see .tk-robot-canvas: 220%) so animated limbs never leave the frame.
// The camera pulls back by the same factor to keep the apparent size.
const STAGE_OVERSCAN = 2.2;

const CLIPS = {
    idle: 'idle',
    greeting: 'start',
    ready: 'idle moving',
    closing: 'Chat closing',
};

const ONE_SHOT_PHASES = new Set(['greeting', 'closing']);

function createSmoothStudioEnvironment(renderer)
{
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    const skyGradient = context.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#ffffff');
    skyGradient.addColorStop(0.42, '#dfe5ef');
    skyGradient.addColorStop(1, '#c5cedc');
    context.fillStyle = skyGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const paintGlow = (x, y, radius, color) =>
    {
        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, color);
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    paintGlow(14, 7, 18, 'rgba(255, 255, 255, 0.46)');
    paintGlow(48, 10, 20, 'rgba(236, 244, 255, 0.34)');
    paintGlow(32, 27, 24, 'rgba(255, 255, 255, 0.28)');

    const environmentSource = new THREE.CanvasTexture(canvas);
    environmentSource.mapping = THREE.EquirectangularReflectionMapping;
    environmentSource.colorSpace = THREE.SRGBColorSpace;
    environmentSource.needsUpdate = true;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromEquirectangular(environmentSource).texture;
    environmentSource.dispose();
    pmremGenerator.dispose();
    return environment;
}

// Contrast pass (user request 2026-06-12): a much stronger key + rim with the
// flat fills (ambient/hemisphere/side fills) pulled way down, so the lit side
// pops and the off side actually falls into shadow. Under/panel lights are
// boosted ~1.5x so the surrounding glow stays visible on the body.
function addLighting(scene, lightRig)
{
    const ambient = new THREE.AmbientLight(0xffffff, 0.08);
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0xdfe4ee, 0.46);
    const key = new THREE.DirectionalLight(0xffffff, 4.4);
    const fill = new THREE.DirectionalLight(0xf9fbff, 0.32);
    const left = new THREE.DirectionalLight(0xffffff, 0.2);
    const right = new THREE.DirectionalLight(0xffffff, 0.2);
    const rim = new THREE.DirectionalLight(0xf4f8ff, 3.0);
    const underFill = new THREE.PointLight(0xe8fbff, 1.18, 8, 1.42);
    const underCenter = new THREE.PointLight(0xffffff, 0.64, 6.5, 1.55);
    const underLeft = new THREE.PointLight(0xe6f9ff, 0.76, 6.5, 1.52);
    const underRight = new THREE.PointLight(0xffffff, 0.7, 6.5, 1.52);
    const underBack = new THREE.PointLight(0xeaf4ff, 0.48, 6, 1.7);
    const topFill = new THREE.PointLight(0xffffff, 1.18, 9, 1.5);
    const frontFill = new THREE.PointLight(0xf4f8ff, 0.79, 8, 1.8);
    const sideGlow = new THREE.PointLight(0xeaf4ff, 0.64, 8, 1.8);
    const lowerFrontPanel = new THREE.RectAreaLight(0xffffff, 2.17, 2.4, 0.9);
    const lowerLeftPanel = new THREE.RectAreaLight(0xecf6ff, 1.76, 1.5, 2.4);
    const lowerRightPanel = new THREE.RectAreaLight(0xffffff, 1.57, 1.5, 2.2);
    const floorPanel = new THREE.RectAreaLight(0xdff8ff, 2.77, 3.2, 1.0);
    const floorLeftPanel = new THREE.RectAreaLight(0xf3fbff, 1.91, 1.45, 1.9);
    const floorRightPanel = new THREE.RectAreaLight(0xffffff, 1.76, 1.45, 1.9);
    const lowerBackPanel = new THREE.RectAreaLight(0xe9f4ff, 1.29, 2.4, 1.0);

    key.position.set(-3.8, 5.4, 2.2);
    fill.position.set(4.6, 3.4, 1.2);
    left.position.set(-5, 2, 0.5);
    right.position.set(5, 2, 0.5);
    rim.position.set(0, 3.2, -5.2);
    underFill.position.set(0, -1.05, 2.45);
    underCenter.position.set(0.15, -1.18, 0.55);
    underLeft.position.set(-1.9, -0.8, 1.65);
    underRight.position.set(2.1, -0.75, 1.25);
    underBack.position.set(0, -0.75, -1.6);
    topFill.position.set(-1.9, 4.6, -0.9);
    frontFill.position.set(-3.7, 2.8, 2.4);
    sideGlow.position.set(4.4, 2.1, 0.2);
    lowerFrontPanel.position.set(-2.7, 0.45, 3.05);
    lowerLeftPanel.position.set(-4.2, 0.3, 1.45);
    lowerRightPanel.position.set(3.9, 0.22, 1.05);
    floorPanel.position.set(0.15, -1.28, 2.1);
    floorLeftPanel.position.set(-2.4, -1.16, 1.2);
    floorRightPanel.position.set(2.55, -1.12, 0.8);
    lowerBackPanel.position.set(0, 0.15, -3.1);
    lowerFrontPanel.lookAt(0, 0.9, -0.1);
    lowerLeftPanel.lookAt(0, 0.82, 0);
    lowerRightPanel.lookAt(0, 0.82, 0);
    floorPanel.lookAt(0, 0.55, 0);
    floorLeftPanel.lookAt(0, 0.75, 0);
    floorRightPanel.lookAt(0, 0.75, 0);
    lowerBackPanel.lookAt(0, 0.75, 0);

    for (const light of [key, fill, left, right, rim])
    {
        light.target.position.set(0, 1.05, 0);
        lightRig.add(light, light.target);
    }

    scene.add(ambient, hemisphere);
    lightRig.add(
        underFill,
        underCenter,
        underLeft,
        underRight,
        underBack,
        topFill,
        frontFill,
        sideGlow,
        lowerFrontPanel,
        lowerLeftPanel,
        lowerRightPanel,
        floorPanel,
        floorLeftPanel,
        floorRightPanel,
        lowerBackPanel,
    );
}

function prepareModel(scene, renderer)
{
    scene.traverse((object) =>
    {
        if (!object.isMesh) return;

        object.castShadow = false;
        object.receiveShadow = false;

        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials)
        {
            material.color?.set(0xa1a7b1);
            material.emissive?.set(0x7d8794);
            material.emissiveIntensity = 0.004;
            material.metalness = 0.42;
            material.roughness = MATERIAL_ROUGHNESS;
            material.envMapIntensity = MATERIAL_ENV_MAP_INTENSITY;
            if (material.map)
            {
                material.map.colorSpace = THREE.SRGBColorSpace;
                material.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
            }
            material.needsUpdate = true;
        }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = ROBOT_SIZE / maxAxis;

    scene.position.sub(center);
    scene.scale.setScalar(scale);

    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledSize = scaledBox.getSize(new THREE.Vector3());
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    scene.position.y += scaledSize.y / 2 - scaledCenter.y;
}

// Renders the robot on a transparent square canvas and plays the clip that
// matches `phase`. One-shot phases (greeting/closing) report back through
// `onPhaseEnd` when their clip finishes.
const RobotStage = ({ phase, onPhaseEnd, onReady, onError }) =>
{
    const canvasRef = useRef(null);
    const stageRef = useRef(null);
    const phaseRef = useRef(phase);
    const callbacksRef = useRef({ onPhaseEnd, onReady, onError });

    callbacksRef.current = { onPhaseEnd, onReady, onError };

    const playPhase = useCallback((nextPhase) =>
    {
        const stage = stageRef.current;
        if (!stage?.mixer) return;

        const clipName = CLIPS[nextPhase] || CLIPS.idle;
        const action = stage.actions.get(clipName) || stage.actions.values().next().value;
        if (!action || action === stage.activeAction) return;

        if (ONE_SHOT_PHASES.has(nextPhase))
        {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
        } else
        {
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.clampWhenFinished = false;
        }

        action.reset();
        if (stage.activeAction)
        {
            action.crossFadeFrom(stage.activeAction, 0.35, false);
        }
        action.play();
        stage.activeAction = action;
    }, []);

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        let disposed = false;
        let frameId = 0;

        let renderer;
        try
        {
            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            });
        } catch (error)
        {
            callbacksRef.current.onError?.(error);
            return undefined;
        }

        RectAreaLightUniformsLib.init();

        // 1.5 instead of 2: the overscanned canvas is large and the rig is
        // per-pixel expensive (RectAreaLights); 1.5 looks identical on this
        // soft glossy model and frees a lot of GPU for the page videos.
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.16;

        const scene = new THREE.Scene();
        scene.background = null;
        scene.environment = createSmoothStudioEnvironment(renderer);
        scene.environmentIntensity = 0.55;

        const lightRig = new THREE.Group();
        scene.add(lightRig);
        addLighting(scene, lightRig);

        const yaw = THREE.MathUtils.degToRad(FIXED_LIGHT_ROTATION.yaw);
        const pitch = THREE.MathUtils.degToRad(FIXED_LIGHT_ROTATION.pitch);
        lightRig.rotation.set(pitch, yaw, 0);
        scene.environmentRotation.set(pitch, yaw, 0);

        // Framing tuned against the animated poses (idle hover + the open-armed
        // greeting); the bind-pose bounding box is much taller than the robot
        // actually stands, so it cannot be derived from the box. 6.4 frames the
        // robot snugly; STAGE_OVERSCAN widens the free space around it.
        const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
        camera.position.set(0, 1.0, 6.4 * STAGE_OVERSCAN);
        camera.lookAt(0, 1.0, 0);

        const root = new THREE.Group();
        scene.add(root);

        const stage = {
            renderer,
            scene,
            camera,
            root,
            mixer: null,
            actions: new Map(),
            activeAction: null,
        };
        stageRef.current = stage;
        canvas.__tkStage = stage;

        const resize = () =>
        {
            const rect = canvas.getBoundingClientRect();
            const edge = Math.max(1, Math.floor(Math.min(rect.width, rect.height) || rect.width));
            renderer.setSize(edge, edge, false);
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        resize();

        // Skip all work while the robot is scrolled out of view — rendering
        // this rig off-screen competes with the section videos for the GPU.
        let isOnScreen = true;
        const visibilityObserver = new IntersectionObserver(([entry]) =>
        {
            isOnScreen = entry.isIntersecting;
        });
        visibilityObserver.observe(canvas);

        const clock = new THREE.Clock();
        const animate = () =>
        {
            frameId = requestAnimationFrame(animate);
            if (!isOnScreen) return;
            const delta = Math.min(clock.getDelta(), 0.05);
            stage.mixer?.update(delta);
            root.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.035;
            renderer.render(scene, camera);
        };

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(`${process.env.PUBLIC_URL}/draco/gltf/`);
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            `${process.env.PUBLIC_URL}/assets/takhial-robot.glb`,
            (gltf) =>
            {
                if (disposed) return;

                prepareModel(gltf.scene, renderer);
                root.add(gltf.scene);

                const mixer = new THREE.AnimationMixer(gltf.scene);
                stage.mixer = mixer;
                for (const clip of gltf.animations)
                {
                    stage.actions.set(clip.name, mixer.clipAction(clip));
                }

                mixer.addEventListener('finished', (event) =>
                {
                    // A clip interrupted by a crossfade still finishes while
                    // fading out — only the active clip may end the phase.
                    if (event.action !== stage.activeAction) return;
                    if (ONE_SHOT_PHASES.has(phaseRef.current))
                    {
                        callbacksRef.current.onPhaseEnd?.(phaseRef.current);
                    }
                });

                playPhase(phaseRef.current);
                animate();
                callbacksRef.current.onReady?.();
            },
            undefined,
            (error) =>
            {
                if (disposed) return;
                callbacksRef.current.onError?.(error);
            },
        );

        return () =>
        {
            disposed = true;
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
            stage.mixer?.stopAllAction();
            renderer.dispose();
            stageRef.current = null;
        };
    }, [playPhase]);

    useEffect(() =>
    {
        phaseRef.current = phase;
        playPhase(phase);
    }, [phase, playPhase]);

    return <canvas ref={canvasRef} className="tk-robot-canvas" aria-hidden="true" />;
};

export default RobotStage;
