import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { createCinematicScene } from "./cinematicScene";

// Behaviour and numeric layout contract measured in the public homepage client.
// The renderer is kept independent from React and from the extraction artifacts.
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const cubic = (x) => x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;

const vertex = /* glsl */ `
uniform vec2 uSize;
uniform vec3 uStages;
uniform float uTime;
uniform float uKind;
uniform float uLive;
uniform sampler2D uPacked;
attribute vec3 offset;
varying vec2 vTex;
varying vec3 vPoint;
varying float vMetadata;

mat2 turn(float a) { return mat2(cos(a),sin(a),-sin(a),cos(a)); }

vec3 drift(vec3 seed) {
  float x = seed.x * 1.77 + uTime * .0125;
  x += sin(uTime * 1.314119 + seed.x * 14.7 + seed.y * 3.75) * .025;
  float y = seed.y + sin(uTime * 1.2853 + seed.y * 21.1415 + seed.x * 5.94) * .025;
  y += sin(uTime * .4 + seed.x * 4.) * .1;
  return vec3(fract(x / 1.77) * 1.77 - .885, fract(y) - .5, 0.);
}
vec3 snapped(vec3 p) {
  return vec3((floor(p.x * 1.95) / 3. + 1. / 6.) * 1.25,
    floor(p.y * 2.6) / 4. + .125, 0.);
}
vec4 scenePosition(vec3 local) {
  float phone = 1. - step(768.,uSize.x);
  float tablet = step(768.,uSize.x) * (1. - step(1450.,uSize.x));
  float band = phone + tablet * .8;
  float wide = 1. - phone - tablet;
  vec4 world = modelMatrix * vec4(local,1.);
  world.xyz *= 1. - .1 * uStages.y * (1. - band);
  world.xyz *= mix(1.,1. / (uSize.y / uSize.x + .25),band);
  world.xyz *= 1. + .2 * tablet * uStages.y;
  world.yz = turn(.35 * uStages.y) * world.yz;
  vec4 projected = projectionMatrix * viewMatrix * world;
  projected.x += (1.4 * uStages.y * (1. - uStages.z) - 1.5 * uStages.z) * wide;
  projected.y += (1. + .95 * uStages.y) * (phone + tablet) + .7 * (phone + tablet);
  return projected;
}
vec4 finishPosition(vec4 screenPoint, vec3 local) {
  vec4 p = mix(screenPoint,scenePosition(local),uStages.x);
  float wide = step(1450.,uSize.x);
  vec4 centered = p;
  float fit = (uSize.y - 338.) / uSize.y;
  float bias = uSize.x > uSize.y + 200. ? 1.5 : 1.;
  centered.xy /= centered.w;
  centered.xy *= bias * fit;
  centered.y += 162. / uSize.y;
  centered.xy *= centered.w;
  return mix(p,centered,uStages.x * (1. - uStages.y) * wide);
}
void main() {
  vTex = uv;
  vMetadata = uLive>.5 ? 0. : dot(texture2D(uPacked,vec2(1.)),vec4(1.,-1.,0.,0.));
  float aspect = uSize.x / uSize.y;
  float band = uSize.x < 768. ? 1. : (uSize.x < 1450. ? .8 : 0.);
  vec3 local = position;
  vec4 screenPoint;
  if(uKind < 2.5) {
    float pad = uKind < .5 ? mix(24.,16.,band) : (uKind < 1.5 ? 33. : mix(33.,24.,band));
    float nav = uKind > .5 && uKind < 1.5 ? 88. : mix(88.,72.,band);
    float side = position.x >= 0. ? 1. : -1.;
    float up = step(0.,position.y);
    screenPoint = vec4(position,1.);
    screenPoint.x = (position.x - .5 * side) / aspect + side * (1. - 2. * pad / uSize.x);
    screenPoint.y += up * (.5 - 2. * nav / uSize.y) - (1. - up) * (.5 - 2. * pad / uSize.y);
    if(uKind > 1.5) local.x += side * .385;
    else local.x *= 1.77;
  } else if(uKind < 5.5) {
    vec3 front = drift(offset);
    vec3 back = snapped(front);
    float perspectiveAspect = mix(aspect,1.,uStages.x);
    if(uKind < 4.5) {
      vec3 anchor = uKind < 3.5 ? front : back;
      local = position * .02 + anchor;
      vec3 flatLocal = position * .02;
      flatLocal.x /= perspectiveAspect * .5;
      screenPoint = vec4((flatLocal + anchor) / vec3(1.77,1.,1.) * 1.9,1.);
    } else {
      float t = -position.z;
      front.z = .5; back.z = -.5;
      vec3 a = vec3(front.xy,-.1), b = vec3(front.xy,-.375);
      vec3 c = vec3(back.xy,-.125), d = vec3(back.xy,-.4);
      float q = 1. - t;
      local = q*q*q*a + 3.*q*q*t*b + 3.*q*t*t*c + t*t*t*d;
      if(t < .01) local = front;
      if(t > .99) local = back;
      vec3 flatLocal = position;
      flatLocal.x /= perspectiveAspect;
      screenPoint = vec4((flatLocal + mix(front,back,t)) / vec3(1.77,1.,1.) * 1.9,1.);
    }
  } else if(uKind < 6.5) {
    vec3 p = position;
    p.x /= mix(aspect,1.,uStages.x) * .5;
    screenPoint = vec4(p / vec3(1.77,1.,1.) * 1.9,1.);
  } else {
    float cell = floor(offset.x*3. + offset.y*4.);
    float angle = 1.5 + sin(uTime*2.74+cell*3.14)*.5 + sin(uTime*3.45+cell*1.43)*.5;
    angle = clamp(floor(angle*angle),0.,1.) * .7853975;
    local.xy = turn(angle) * local.xy;
    screenPoint = vec4(local * vec3(1.25/1.77,1.25,1.25) + offset / vec3(1.77,1.,1.)*1.9,1.);
    local += offset;
  }
  vPoint = local;
  gl_Position = finishPosition(screenPoint,local);
}
`;

const fragment = /* glsl */ `
uniform vec2 uSize;
uniform vec3 uStages;
uniform sampler2D uPacked;
uniform sampler2D uNumbers;
uniform float uTime;
uniform float uKind;
uniform float uLayer;
uniform float uFade;
uniform float uIntro;
uniform float uFallback;
uniform float uOverlayOpacity;
uniform float uLive;
uniform float uSceneGain;
varying vec2 vTex;
varying vec3 vPoint;
varying float vMetadata;

float roundedMask(float aspect) {
  float radius = mix(16./uSize.y,.078,uStages.x);
  vec2 q = abs((vTex-.5)*vec2(aspect,1.))-vec2(aspect*.5,.5)+radius;
  float d = min(max(q.x,q.y),0.) + length(max(q,0.)) - radius;
  float aa = max(length(vec2(dFdx(d),dFdy(d)))*.70710678,.000001);
  return 1.-smoothstep(-aa,aa,d);
}
vec2 mediaUV(bool contour) {
  float imgAspect=16./9.;
  float band=uSize.x<768.?1.:(uSize.x<1450.?.8:0.);
  float nav=contour?88.:mix(88.,72.,band);
  float screenAspect=uSize.x/uSize.y;
  float inv=(uSize.y-nav)/uSize.x;
  // The crop is the measured contract and stays exactly as authored. The live
  // render target is a 16:9 frame like the film, so it maps the same way; it
  // only skips the packed atlas offset below, because it carries no mask band.
  vec2 crop=screenAspect<imgAspect?vec2(screenAspect/imgAspect,1.):vec2(1.,(contour?uSize.y/uSize.x:inv)*imgAspect);
  crop=mix(crop,vec2(imgAspect*.5,1.),uStages.x);
  vec2 p=(vTex-.5)*crop+.5;
  if(uLive>.5||uFallback>.5) return p;
  if(contour) return p*.2+vec2(0.,.8);
  p*=.8;
  if(uSize.y>uSize.x) p.x-=inv*.1*vMetadata*(1.-uStages.x);
  return .5+(p-.5)/uIntro;
}
float contourEdge(vec2 p) {
  vec2 e=.125/vec2(textureSize(uPacked,0));
  float r=texture2D(uPacked,p).r;
  float aa=max(length(vec2(dFdx(r),dFdy(r)))*.70710678,.000001);
  vec4 d=vec4(texture2D(uPacked,p+e*vec2(-1.,1.)).r,
              texture2D(uPacked,p+e*vec2(1.,1.)).r,
              texture2D(uPacked,p+e*vec2(-1.,-1.)).r,
              texture2D(uPacked,p+e*vec2(1.,-1.)).r);
  d=smoothstep(vec4(.5-aa),vec4(.5+aa),d);
  return length(vec2(d.x-d.w,d.y-d.z));
}
float hash(vec2 p) { return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
void main() {
  vec3 color=vec3(1.);
  float alpha=1.;
  float a=uStages.x,b=uStages.y,c=uStages.z;
  if(uKind<1.5) {
    float band=uSize.x<768.?1.:(uSize.x<1450.?.8:0.);
    float nav=uKind<.5?mix(88.,72.,band):88.;
    alpha=roundedMask(mix(uSize.x/(uSize.y-nav),1.77,a));
    if(uKind<.5) {
      vec3 media=texture2D(uPacked,mediaUV(false)).rgb;
      // Three renders into an ordinary render target in linear space, so the
      // live frame needs the sRGB transfer the video texture already carried.
      if(uLive>.5) media=mix(pow(media,vec3(.41666))*1.055-vec3(.055),media*12.92,vec3(lessThanEqual(media,vec3(.0031308))));
      color=media*uSceneGain+vec3(.08*a);
      alpha*=1.-.5*b;
    } else {
      if(uFallback>.5||uLive>.5) discard; // no mask channel outside the packed atlas
      float edge=contourEdge(mediaUV(true));
      if(uLayer<.5) alpha*=clamp(edge*2.,0.,1.)*a*.75*(1.-.75*c);
      else alpha*=edge*a*b*(1.-c)*.25;
    }
  } else if(uKind<2.5) {
    alpha=smoothstep(0.,.3,a);
    if(uLayer<.5) alpha*=.75*(1.-.75*c);
    else if(uLayer<2.5) alpha*=.25*b*(1.-c);
    else if(uLayer<3.5) alpha*=.75*mix(1.-.75*b,1.,c);
    else alpha*=.25*c*uFade;
  } else if(uKind<3.5) alpha=.75*smoothstep(0.,.5,a)*(1.-.75*c)*uFade;
  else if(uKind<4.5) alpha=.5*smoothstep(0.,.75,a)*(1.-b*(1.-c))*uFade;
  else if(uKind<5.5) {
    float z=-vPoint.z;
    float dots=z>=0.?1.:1.-step(.3,fract(z*30.));
    float left=.1-.2*c+.1*b,right=-.2-.2*c+.1*b;
    float back=1.-smoothstep(right,left,vPoint.z);
    alpha=.75*smoothstep(0.,1.,a)*mix(1.-.75*c,1.-b*(1.-c),back)*dots*uFade;
  } else if(uKind<6.5) {
    float slot=floor(vTex.x*4.)/4.;
    float seed=hash(vec2(slot,slot+floor(vPoint.y*4.)*3.14+floor(vPoint.x*4.)*7.89));
    float bit=floor(sin(uTime*6.14+seed*2.+slot*2.)+1.);
    vec2 glyph=vec2(fract(vTex.x*4.)*.5+.5*bit,vTex.y);
    alpha=texture2D(uNumbers,glyph).r;
    float cell=floor(vPoint.x*3.+vPoint.y*4.);
    float mask=1.5-slot+sin(uTime*.74+cell*3.14)*.5+sin(uTime*1.45+cell*1.43)*.5;
    alpha*=clamp(floor(mask*mask),0.,1.)*smoothstep(0.,.75,a)*mix(1.-.75*b,1.,c);
    alpha=clamp(alpha-step(.2,max(length(dFdx(glyph)),length(dFdy(glyph)))),0.,1.);
  } else alpha=.25*smoothstep(0.,.3,a)*c*uFade;
  float sceneFade=(uKind>.5 && uKind<1.5 && uLayer>.5)?1.:uFade;
  // Only decorative layers fade here; kind 0 is the untouched RGB video plane.
  if(uKind>.5) alpha=clamp(alpha,0.,1.)*uOverlayOpacity;
  gl_FragColor=vec4(color,alpha*sceneFade);
}
`;

function rectangle(width = 1, height = 1, radius = .075, segments = 256) {
  const points = [];
  const corners = [[1,1],[-1,1],[-1,-1],[1,-1]];
  for (let i=0;i<segments;i++) {
    const corner=Math.floor(i/(segments/4));
    const [sx,sy] = corners[corner];
    const theta=i/segments*Math.PI*2;
    points.push(sx*(width/2-radius)+Math.cos(theta)*radius,
      sy*(height/2-radius)+Math.sin(theta)*radius,0);
  }
  points.push(...points.slice(0,3));
  return points;
}

function lineGeometry(points, offsets) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
  if(offsets) geo.setAttribute("offset",new THREE.Float32BufferAttribute(offsets,3));
  return geo;
}

function numberTexture() {
  const atlas = document.createElement("canvas");
  atlas.width = 128;
  atlas.height = 64;
  const context = atlas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, atlas.width, atlas.height);
  context.fillStyle = "#fff";
  context.font = "500 50px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("0", 32, 33);
  context.fillText("1", 96, 33);
  return new THREE.CanvasTexture(atlas);
}

/* `video` is optional. Without it the opening is rendered live from
   cinematicScene.js instead of sampled from the packed film. */
export function createHeroRenderer(canvas, video, onPhase) {
  const live = !video;
  if (video) {
    video.muted=true;
    video.defaultMuted=true;
  }
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(23,1,.01,200);
  camera.position.z = 5;
  const group = new THREE.Group();
  scene.add(group);
  const cinematic = live ? createCinematicScene(renderer) : null;
  const packed = live ? cinematic.texture : new THREE.VideoTexture(video);
  const uniforms = {
    uSize:{value:new THREE.Vector2(1,1)},uStages:{value:new THREE.Vector3()},
    uTime:{value:0},uFade:{value:1},uIntro:{value:1.2},uFallback:{value:0},
    uOverlayOpacity:{value:0.25},
    uLive:{value:live?1:0},
    // The baked film was dimmed to .6 so the headline could sit on it. The live
    // scene carries its own exposure and a CSS scrim does the same job.
    uSceneGain:{value:live?1:.6},
    uPacked:{value:packed},uNumbers:{value:null},
  };
  const loader = new THREE.TextureLoader();
  const numbers = numberTexture();
  uniforms.uNumbers.value = numbers;
  const resources = new Set(live?[numbers]:[packed,numbers]);
  const add = (geo,kind,layer,z,order,line=false) => {
    const material = new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,
      uniforms:{...uniforms,uKind:{value:kind},uLayer:{value:layer}},
      transparent:true,depthTest:false,depthWrite:false});
    const object = line === "strip" ? new THREE.Line(geo,material) : line ? new THREE.LineSegments(geo,material) : new THREE.Mesh(geo,material);
    object.position.z=z; object.renderOrder=order; object.frustumCulled=false;
    group.add(object);resources.add(geo);resources.add(material);
  };
  const plane = new THREE.PlaneGeometry(1,1);
  add(plane,0,0,0,0);
  const border = lineGeometry(rectangle());
  [.5,.4,.3,-.5,-.4,-.3].forEach((z,i)=>add(border,2,i,z,i+1,"strip"));
  [.5,.4,.3].forEach((z,i)=>add(plane,1,i,z,i+10));

  // Thirty moving anchors and their quantized counterparts share one set of seeds.
  const seeds=Array.from({length:30},()=>[Math.random()-.5,Math.random()-.5,0]);
  const trianglePoints=[];
  const arc=(cx,cy,begin,end)=>{
    for(let i=0;i<7;i++) {
      const a=begin+(end-begin)*i/6;
      trianglePoints.push(new THREE.Vector2(cx+.1*Math.cos(a),cy+.1*Math.sin(a)));
    }
  };
  arc(.225,-.575,-Math.PI*.75,0);
  trianglePoints.push(new THREE.Vector2(.325,-.175));
  arc(.225,.225,0,Math.PI*.5);
  trianglePoints.push(new THREE.Vector2(-.175,.325));
  arc(-.575,.225,Math.PI*.5,Math.PI*1.25);
  trianglePoints.push(trianglePoints[0].clone());
  const tp=[],to=[];
  for(const seed of seeds) for(let i=0;i<trianglePoints.length-1;i++) {
    tp.push(trianglePoints[i].x,trianglePoints[i].y,0,trianglePoints[i+1].x,trianglePoints[i+1].y,0);
    to.push(...seed,...seed);
  }
  const triangleGeo=lineGeometry(tp,to);
  add(triangleGeo,3,0,.5,8,true);add(triangleGeo,4,0,-.5,9,true);
  const trailPoints=[],trailOffsets=[];
  for(const seed of seeds) for(let i=0;i<32;i++) {
    trailPoints.push(0,0,-i/32,0,0,-(i+1)/32);trailOffsets.push(...seed,...seed);
  }
  add(lineGeometry(trailPoints,trailOffsets),5,0,0,7,true);
  const quads=[];
  for(let x=0;x<4;x++) for(let y=0;y<4;y++) {
    const q=new THREE.PlaneGeometry(.06,.015);
    q.translate((x/4-.375)*1.6815+.075,(y/4-.375)*1.0125+.045,0);
    quads.push(q);
  }
  add(mergeGeometries(quads),6,0,-.5,13);
  quads.forEach(q=>q.dispose());
  const glyph=rectangle(.05,.05,.01,32),gp=[],go=[];
  for(let x=0;x<4;x++) for(let y=0;y<4;y++) for(let z=0;z<3;z++) {
    const seed=[(x/4-.375)*1.6815,(y/4-.375),z*.1];
    for(let i=0;i<glyph.length-3;i+=3) {gp.push(...glyph.slice(i,i+6));go.push(...seed,...seed);}
  }
  add(lineGeometry(gp,go),7,0,-.5,14,true);

  let width=1,height=1,frame=0,last=0,start=performance.now(),disposed=false,active=true;
  let progress=0,lastPhase="",transitionStart=[0,0],from=[0,0],target=[0,0],frames=0,direction=1;
  const pointer=new THREE.Vector2(),gaze=new THREE.Vector2();
  function resize() {
    const rect=canvas.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    // The packed film tops out at 1536x864, so there was nothing to gain above
    // 1.5. A live scene has no source resolution to run out of.
    const ratio=Math.min(devicePixelRatio||1,live?2:1.5);
    renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);
    if(cinematic) {
      // The shape of the media rectangle the shader actually paints, which is
      // what mediaUV()'s cover-crop leaves visible out of the 16:9 frame.
      const band=width<768?1:(width<1450?.8:0);
      const nav=88-16*band;
      const visible=width/height<16/9?width/height:width/Math.max(1,height-nav);
      cinematic.setSize(width*ratio,height*ratio,visible);
    }
    uniforms.uSize.value.set(width,height);camera.aspect=width/height;
    const band=width<768?height*.45-32:height*.5-32;
    camera.zoom=width<1450?Math.max(Math.min(width,band)/width,Math.tan(23*Math.PI/360)/Math.tan(58*Math.PI/360)):1;
    camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  function move(event) {
    if(width<1450) {
      const band=Math.max(1,height*(width<768?.45:.5)-32);
      const span=Math.min(width,band);
      const px=clamp(event.clientX-(width-span)*.5,0,span);
      const py=clamp(event.clientY,0,band);
      pointer.set((clamp(px/span)-.5)*8,(clamp(py/span)-.5)*4);
    } else pointer.set((event.clientX/width-.5)*8,(event.clientY/height-.5)*4);
  }
  function resetPointer(){pointer.set(0,0);}
  window.addEventListener("pointermove",move,{passive:true});window.addEventListener("blur",resetPointer);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fallback() {
    if(uniforms.uFallback.value) return;
    const poster=loader.load("/takhaial/media/ai-cinematic-poster.webp");resources.add(poster);
    uniforms.uPacked.value=poster;uniforms.uFallback.value=1;
    canvas.dataset.media="poster";
  }
  video?.addEventListener("error",fallback);
  const play=()=>{if(!reduced&&active&&!document.hidden) video?.play().catch(()=>{canvas.dataset.media="awaiting-gesture";});};
  window.addEventListener("pointerdown",play,{passive:true});
  function visibility(){if(document.hidden) video?.pause();else play();}
  document.addEventListener("visibilitychange",visibility);
  if(reduced&&!live) {video.pause();fallback();} else if(!reduced) play();

  function tick(now) {
    if(disposed) return;
    const dt=Math.min(64,now-(last||now));last=now;
    const old=progress;
    progress=clamp(window.scrollY/(innerHeight*(innerWidth<=768?2.15:4.7)));
    if(Math.abs(progress-old)>.000001) direction=progress>old?1:-1;
    const next=[progress>=.3?1:0,progress>=.6?1:0];
    for(let i=0;i<2;i++) if(next[i]!==target[i]) {
      from[i]=i===0?uniforms.uStages.value.y:uniforms.uStages.value.z;
      target[i]=next[i];transitionStart[i]=now;
    }
    const blend=transitionStart.map(t=>cubic(clamp((now-t)/1000)));
    const first=cubic(clamp(progress/.2));
    uniforms.uStages.value.set(first,from[0]+(target[0]-from[0])*blend[0],from[1]+(target[1]-from[1])*blend[1]);
    uniforms.uFade.value=1-cubic(clamp((progress-.8)/.2));
    uniforms.uTime.value=(now-start)/1000;
    uniforms.uIntro.value=1;
    group.rotation.y=-.6-.4*progress;
    group.scale.z=.5-.5*Math.cos(Math.PI*clamp(progress/.1));
    const strength=clamp((first-.2)/.8)*.15;
    gaze.lerp(pointer,1-Math.pow(.94,dt/(1000/60)));
    camera.position.set(gaze.x*strength,gaze.y*strength,5);camera.lookAt(0,0,0);
    const phase=progress<=.035?"opening":progress<.1?"pull-apart":progress<.3?"reliability":progress<.6?"applications":progress<(direction<0?.997:.85)?"data":"exit";
    canvas.dataset.direction=direction<0?"reverse":"forward";
    if(phase!==lastPhase){lastPhase=phase;onPhase?.(phase,direction);canvas.dataset.phase=phase;}
    canvas.dataset.progress=progress.toFixed(4);
    const shouldBeActive=window.scrollY<innerHeight*5.5&&!document.hidden;
    if(shouldBeActive!==active){active=shouldBeActive;if(active)play();else video?.pause();}
    if(active||old!==progress) {
      const c=1-cubic(clamp(progress/.1));renderer.setClearColor(new THREE.Color().setRGB(c,c,c,THREE.SRGBColorSpace),1);
      if(cinematic) {
        // Frozen on a composed frame when the visitor asked for less motion.
        cinematic.render(reduced?12:((now-start)/1000)%cinematic.duration);
        canvas.dataset.media="live";
      } else if(video.readyState>=2) canvas.dataset.media="video";
      renderer.render(scene,camera);canvas.dataset.frames=String(++frames);
    }
    frame=requestAnimationFrame(tick);
  }
  canvas.dataset.renderer="webgl";
  canvas.dataset.renderables=String(group.children.length);
  frame=requestAnimationFrame(tick);
  return ()=>{
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();video?.pause();
    cinematic?.dispose();
    video?.removeEventListener("error",fallback);document.removeEventListener("visibilitychange",visibility);
    window.removeEventListener("pointermove",move);window.removeEventListener("blur",resetPointer);window.removeEventListener("pointerdown",play);
    resources.forEach(r=>r.dispose());renderer.dispose();
  };
}
