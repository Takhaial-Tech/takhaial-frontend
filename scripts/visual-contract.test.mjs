import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import postcss from 'postcss';
import {mediaFrames,getMediaFrame} from '../src/takhaial/mediaFraming.js';

const css=postcss.parse(await fs.readFile('src/takhaial/site.css','utf8'));
const tokens=postcss.parse(await fs.readFile('src/takhaial/tokens.css','utf8'));
const variables={};for(const sheet of [tokens,css])sheet.walkRules(rule=>{if(rule.selector===':root')rule.walkDecls(d=>{if(d.prop.startsWith('--'))variables[d.prop]=d.value;});});
const darkVars={...variables};css.walkRules(rule=>{if(rule.selector==='.tk-dark')rule.walkDecls(d=>{if(d.prop.startsWith('--'))darkVars[d.prop]=d.value;});});
function value(selector,property){let result;css.walkRules(rule=>{if(rule.parent.type==='atrule')return;if(rule.selector.split(',').map(s=>s.trim()).includes(selector))rule.walkDecls(property,d=>{result=d.value;});});assert.ok(result,`${selector} has ${property}`);return result;}
function resolve(color,vars){for(let i=0;i<12&&color.startsWith('var(');i++){const name=color.slice(4,-1);assert.ok(vars[name],name);color=vars[name];}return color;}
function linearRGB(color){
 if(color.startsWith('oklch(')){
  const [L,C,H]=color.match(/[-+]?\d*\.?\d+/g).map(Number),a=C*Math.cos(H*Math.PI/180),b=C*Math.sin(H*Math.PI/180);
  const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;
  return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s].map(v=>Math.min(1,Math.max(0,v)));
 }
 if(color==='white')color='#ffffff';if(color==='black')color='#000000';
 let hex=color.slice(1);if(hex.length===3)hex=[...hex].map(c=>c+c).join('');assert.match(hex,/^[0-9a-f]{6}$/i);
 return hex.match(/../g).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
}
const luminance=rgb=>rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
function contrast(fg,bg,vars){const a=luminance(linearRGB(resolve(fg,vars))),b=luminance(linearRGB(resolve(bg,vars)));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}

test('supporting text and controls meet measured4.5:1 palette targets',async()=>{
 const checks=[
  ['Main copy',':root',':root'],['Light captions','.tk-card-caption small',':root'],['Dark captions','.tk-card-caption small','.tk-dark',true],
  ['Footer','.tk-footer-bottom','.tk-footer'],['Workflow choice','.tk-workflow__tabs button','.tk-workflow__tabs'],['Workflow labels','.tk-flow-input > span','.tk-workflow'],
  ['Workflow output status','.tk-flow-output small','.tk-workflow'],['Workflow controls note','.tk-flow-controls p','.tk-flow-controls'],
  ['Contact privacy','.tk-form-privacy','.tk-contact__form'],['Placeholder','.tk-contact input::placeholder','.tk-contact input'],
  ['Primary button','.tk-button','.tk-button'],['Light button','.tk-button--light','.tk-button--light',true],['Inverse card arrow','.tk-circle-arrow','.tk-circle-arrow',true],
 ];
 const results=checks.map(([name,fg,bg,dark])=>({name,ratio:contrast(value(fg,'color'),value(bg,'background'),dark?darkVars:variables)}));
 await fs.writeFile('../takhaial-site-evidence/contrast-audit.json',JSON.stringify({at:new Date().toISOString(),scope:'CSS palette pairs, not full rendered WCAG certification',results},null,2));
 for(const r of results)assert.ok(r.ratio>=4.5,`${r.name}: ${r.ratio.toFixed(3)}:1`);
 console.log(results.map(r=>`${r.name}: ${r.ratio.toFixed(2)}:1`).join('\n'));
});

test('video content ratios remove measured borders without stretching or clipping native controls',()=>{
 for(const name of Object.keys(mediaFrames)){
  const f=getMediaFrame(name),[px,py]=f.position.split(' ').map(Number.parseFloat),scale=Math.max(f.w/f.width,f.h/f.height);
  const x=(f.width*scale-f.w)*px/100/scale,y=(f.height*scale-f.h)*py/100/scale;
  assert.ok(Math.abs(x-f.x)<.01&&Math.abs(y-f.y)<.01,name+' fits measured window');
  assert.equal(f.ratio,f.w/f.h);
  const full=getMediaFrame(name,true);assert.deepEqual([full.x,full.y,full.w,full.h],[0,0,f.width,f.height]);
 }
 assert.equal(value('.tk-video-shell video','object-fit'),'cover');
 assert.equal(value('.tk-video-shell video','width'),'100%');
 assert.equal(value('.tk-video-shell video','height'),'100%');
 assert.equal(value('.tk-video-shell video','object-position'),'var(--tk-media-position, 50% 50%)');
});

test('official dark PNG logo files are byte-identical to the supplied masters',async()=>{
 for(const [source,file] of [['9.png','dark-horizontal.png'],['5.png','dark-stacked.png']]){
  const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash(await fs.readFile('A:/Takhaial/PNG LOGOS/'+source)),hash(await fs.readFile('public/takhaial/brand/'+file)));
 }
 const brand=await fs.readFile('src/takhaial/Brand.jsx','utf8');assert.match(brand,/0 399 1080 281/);assert.match(brand,/92 27 895 1025/);
 assert.doesNotMatch(await fs.readFile('src/takhaial/site.css','utf8'),/filter:\s*brightness\(0\)/);
});

test('image overlay caption has a dark scrim at the text band and SVG zoom respects reduced motion',()=>{
 const gradient=value('.tk-media-caption','background');
 assert.match(gradient,/#071323e6 28%/);
 // Worst-case white image behind the caption's90%-opaque scrim.
 const scrim=[7,19,35].map(v=>v*.9+255*.1);
 const bg='#'+scrim.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
 assert.ok(contrast('var(--tk-on-dark)',bg,variables)>7);
 let disabled=false;
 css.walkAtRules('media',media=>{if(media.params.includes('prefers-reduced-motion: reduce'))media.walkRules(rule=>{if(rule.selector.includes('.tk-project-card:hover .tk-poster-crop'))rule.walkDecls('transform',d=>{if(d.value==='none')disabled=true;});});});
 assert.ok(disabled,'Cropped SVG thumbnails must not zoom under reduced motion');
});

test('hero overlay transparency is isolated from the RGB video plane',async()=>{
 const source=await fs.readFile('src/heroRenderer.js','utf8');
 assert.match(source,/uniform float uOverlayOpacity;/);
 assert.match(source,/uOverlayOpacity:\{value:0\.25\}/);
 assert.match(source,/if\(uKind>\.5\) alpha=clamp\(alpha,0\.,1\.\)\*uOverlayOpacity;/);
 // Kind 0 is still the untouched media plane: it takes its own gain and never
 // the decorative attenuation. The film keeps the measured .6; the live scene
 // carries its own exposure and takes 1.
 assert.match(source,/vec3 media=texture2D\(uPacked,mediaUV\(false\)\)\.rgb;/);
 assert.match(source,/color=media\*uSceneGain\+vec3\(\.08\*a\);/);
 assert.match(source,/uSceneGain:\{value:live\?1:\.6\}/);
});

test('AI hero renders its authored motion live while the quote uses an original Takhaial project film',async()=>{
 const hero=await fs.readFile('src/HeroSequence.jsx','utf8');
 const quote=await fs.readFile('src/ScrollingQuote.jsx','utf8');
 const scene=await fs.readFile('src/cinematicScene.js','utf8');
 const renderer=await fs.readFile('src/heroRenderer.js','utf8');
 // The opening is the same authored motion, now rendered rather than replayed:
 // no packed film element, a live scene behind uPacked, and the video fallback
 // and poster still in place for browsers that cannot run it.
 assert.doesNotMatch(hero,/ai-cinematic-packed\.mp4/);
 assert.match(hero,/createHeroRenderer\(canvas\.current,null,/);
 assert.match(hero,/src="\/takhaial\/media\/ai-cinematic-loop\.mp4"/);
 assert.match(hero,/poster="\/takhaial\/media\/ai-cinematic-poster\.webp"/);
 assert.match(renderer,/createCinematicScene\(renderer\)/);
 assert.match(renderer,/uLive:\{value:live\?1:0\}/);
 // The scene keeps the measured numbers of the film it replaces.
 assert.match(scene,/CINEMATIC_DURATION = 26\.5/);
 for(const count of [/band < 9/,/ring < 7/,/i < 72/,/i < 7;/,/i < 65/])assert.match(scene,count);
 assert.match(quote,/src="\/takhaial\/media\/oil-sector-ar\.mp4"/);
 assert.match(quote,/poster="\/takhaial\/media\/oil-sector-ar\.webp"/);
 for(const source of [hero,quote])assert.doesNotMatch(source,/hero-packed-polish|automation-loop/);
 for(const name of ['ai-cinematic-packed.mp4','ai-cinematic-loop.mp4','ai-cinematic-poster.webp','automation-loop.mp4','oil-sector-ar.mp4','oil-sector-ar.webp']){
  assert.ok((await fs.stat('public/takhaial/media/'+name)).size>10000,name+' is real media');
 }
});

test('incoming workflow surface paints above the overlapping hero and contains its heading',async()=>{
 assert.equal(value('.tk-home-offer','position'),'relative');
 assert.equal(value('.tk-home-offer','z-index'),'1');
 assert.equal(value('.tk-home-offer','isolation'),'isolate');
 assert.equal(value('.tk-home-offer','background'),'var(--tk-surface)');
 const source=await fs.readFile('src/TakhaialApp.jsx','utf8');
 assert.match(source,/className="tk-home-offer"\s+aria-labelledby="workflow-section-title"/);
 assert.doesNotMatch(source,/className="tk-home-offer tk-container"/);
 const hero=postcss.parse(await fs.readFile('src/hero-sequence.css','utf8'));
 let level;hero.walkRules(rule=>{if(rule.selector==='.source-hero')rule.walkDecls('z-index',d=>level=d.value);});
 assert.equal(level,'0');
});
