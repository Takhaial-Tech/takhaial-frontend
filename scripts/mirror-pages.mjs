import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {resolveStreams} from './resolve-streams.mjs';

const root=process.cwd(), out=path.join(root,'public'), evidence=path.join(root,'.tasks/clone-scale.com');
const cache=path.join(evidence,'page-cache'), assets=path.join(out,'site-assets'), pagesDir=path.join(out,'site-pages');
await Promise.all([cache,assets,pagesDir].map(p=>fs.mkdir(p,{recursive:true})));
const digest=x=>crypto.createHash('sha256').update(x).digest('hex').slice(0,20);
const hosts=new Set(['scale.com','www.scale.com','labs.scale.com','brand.scale.com','api-reference.scale.com']);
const assetHosts=new Set(['scale.com','www.scale.com','labs.scale.com','brand.scale.com','api-reference.scale.com','console.scale.com','cdn.sanity.io','static.scale.com','mintlify.s3.us-west-1.amazonaws.com','mintlify.s3-us-west-1.amazonaws.com','mintcdn.com','mintlify.b-cdn.net','fonts.gstatic.com']);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const report={started:new Date().toISOString(),pages:[],assets:[],errors:[],external:[],discovered:[]};
const assetPromises=new Map(), assetRecords=new Map();
try{for(const row of JSON.parse(await fs.readFile(path.join(evidence,'asset-cache.json'),'utf8')))assetRecords.set(row.url,row);}catch{}
let downloading=0;const downloadWaiters=[];
async function download(url){
  if(downloading>=8)await new Promise(resolve=>downloadWaiters.push(resolve));
  downloading++;
  try{const response=await request(url);const mime=response.headers.get('content-type')||'',length=Number(response.headers.get('content-length'));
    if(!response.ok)throw new Error('HTTP '+response.status);
    return{mime,length,bytes:length>80*1024*1024?null:Buffer.from(await response.arrayBuffer())};
  }finally{downloading--;downloadWaiters.shift()?.();}
}
let previous={pages:[]};try{previous=JSON.parse(await fs.readFile(path.join(out,'site-manifest.json'),'utf8'));}catch{}
const known=new Map(previous.pages.map(p=>[p.sourceUrl,p]));
function canonical(raw,base='https://scale.com/'){
  try{const u=new URL(raw,base);if(!/^https?:$/.test(u.protocol)||!hosts.has(u.hostname))return null;
    u.hostname=u.hostname==='www.scale.com'?'scale.com':u.hostname;u.hash='';u.search='';
    if(u.pathname!=='/')u.pathname=u.pathname.replace(/\/+$/,'');
    if(/\.(?:png|jpe?g|webp|avif|gif|svg|mp4|webm|pdf|zip|woff2?|js|css|xml|json|ico|csv|txt)$/i.test(u.pathname)||/^\/(?:_next|api|static|mintlify-assets|cdn-cgi)\//.test(u.pathname))return null;
    return u.href;
  }catch{return null;}
}
export function localPath(raw){const u=new URL(raw);let p=u.pathname.replace(/\/+$/,'')||'/';
  if(u.hostname==='labs.scale.com')return '/labs'+(p==='/'?'':p);
  if(u.hostname==='brand.scale.com')return '/brand'+(p==='/'?'':p);
  if(u.hostname==='api-reference.scale.com')return '/api-reference'+(p==='/'?'':p);
  return p;
}
function family(raw){const u=new URL(raw),p=u.pathname;
  if(u.hostname.includes('brand.'))return 'brand';
  if(u.hostname.includes('labs.'))return /leaderboard|showdown|evaluate/.test(p)?'benchmark':'research';
  if(u.hostname.includes('api-reference.')||p.startsWith('/docs'))return 'documentation';
  if(/^\/careers\/\d/.test(p))return 'job';
  if(p.startsWith('/careers'))return 'careers';
  if(p.startsWith('/blog/category'))return 'blog-category';
  if(p==='/blog')return 'blog-index';
  if(p.startsWith('/blog/'))return 'article';
  if(p.startsWith('/guides/'))return 'guide';
  if(p.startsWith('/legal/'))return 'legal';
  if(p.startsWith('/events'))return 'event';
  if(p==='/demo')return 'form';
  return 'marketing';
}
async function request(url){for(let attempt=0;attempt<3;attempt++){
  try{const r=await fetch(url,{signal:AbortSignal.timeout(45000),headers:{'User-Agent':'Mozilla/5.0 (compatible; local website review)','Accept-Language':'en'}});
    if((r.status===429||r.status>=500)&&attempt<2){await wait(1000*(attempt+1));continue;}return r;
  }catch(e){if(attempt===2)throw e;await wait(600);}
}}
function absoluteAsset(raw,base){
  if(!raw||/^(?:data:|blob:|#)/.test(raw))return raw;
  try{let u=new URL(raw,base);
    if(u.pathname==='/_next/image'&&u.searchParams.get('url'))u=new URL(u.searchParams.get('url'),u.origin);
    if(u.hostname==='cdn.sanity.io'&&u.pathname.includes('/images/')){if(Number(u.searchParams.get('w'))>1920)u.searchParams.set('w','1920');}
    return u.href;
  }catch{return raw;}
}
async function asset(raw,base,depth=0){
  const url=absoluteAsset(raw,base);if(!url||!/https?:/.test(url))return url;
  if(assetPromises.has(url))return assetPromises.get(url);
  const work=(async()=>{try{
    const u=new URL(url);if(!assetHosts.has(u.hostname)&&!u.hostname.endsWith('.mintcdn.com'))return url;
    const existing=assetRecords.get(url);
    if(existing?.local){try{await fs.access(path.join(out,existing.local));return existing.local;}catch{}}
    if(existing?.reason==='large media streams from original CDN')return url;
    let ext=path.extname(u.pathname).toLowerCase();if(ext.length>7)ext='';
    const downloaded=await download(url),{mime,length}=downloaded;
    if(length>80*1024*1024){assetRecords.set(url,{url,local:null,bytes:length,reason:'large media streams from original CDN'});return url;}
    const kinds={'text/css':'.css','image/svg+xml':'.svg','image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','image/avif':'.avif','video/mp4':'.mp4','font/woff2':'.woff2','application/pdf':'.pdf'};
    ext=kinds[mime.split(';')[0]]||ext||'.bin';const filename=digest(url)+ext,destination=path.join(assets,filename);
    let bytes=downloaded.bytes;
    if(mime.includes('text/css')&&depth<3){let css=bytes.toString('utf8');const references=[...css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)].map(x=>x[1]);
      for(const ref of new Set(references)){if(/^(data:|#)/.test(ref))continue;const target=await asset(ref,url,depth+1);css=css.split(ref).join(target);}bytes=Buffer.from(css);}
    await fs.writeFile(destination,bytes);const target='/site-assets/'+filename;
    assetRecords.set(url,{url,local:target,bytes:bytes.length,mime});return target;
  }catch(e){assetRecords.set(url,{url,local:null,error:String(e)});return url;}})();
  assetPromises.set(url,work);return work;
}
function resourceLinks($,base){const all=new Set();$('a[href]').each((i,e)=>{const c=canonical($(e).attr('href'),base);if(c)all.add(c);});return [...all];}
async function buildPage(url){
  const id=digest(url),cached=path.join(cache,id+'.html');let html,finalUrl=url,status=200,fromCache=false;
  try{html=await fs.readFile(cached,'utf8');fromCache=true;finalUrl=known.get(url)?.finalUrl||url;}catch{}
  if(!html){const response=await request(url);status=response.status;finalUrl=response.url;html=await response.text();if(response.ok)await fs.writeFile(cached,html);}
  const rawHtml=html;
  try{html=await fs.readFile(path.join(evidence,'hydrated',id+'.html'),'utf8');}catch{}
  const $=load(html),title=$('title').text().trim()||$('h1').first().text().trim()||localPath(url);
  resolveStreams($);
  const links=resourceLinks($,finalUrl),type=family(finalUrl),route=localPath(url);
  if(status!==200)return{sourceUrl:url,finalUrl,path:route,status,title,family:type,file:null,links,error:'Source HTTP '+status};
  const canonicalFinal=canonical(finalUrl);if(canonicalFinal&&canonicalFinal!==url)links.push(canonicalFinal);
  const description=$('meta[name=description]').attr('content')||'';
  const headings=$('h1,h2,h3').map((i,e)=>$(e).text().trim()).get().filter(Boolean);
  const videoRefs=[...rawHtml.matchAll(/https?:[^\s<>"'\\]+\.(?:mp4|webm)(?:\?[^\s<>"'\\]*)?/g)].map(m=>m[0].replaceAll('&amp;','&'));
  $('script,noscript,meta[http-equiv=refresh],link[rel=preload],link[rel=prefetch],link[rel=modulepreload],link[rel=preconnect],link[rel=dns-prefetch]').remove();
  $('[id*=onetrust],[id*=OneTrust],#ot-sdk-btn-floating,[class*=hsfc-Recaptcha],iframe[src*=recaptcha],iframe[src*=hubspot]').remove();
  $('input[type=hidden],meta[name=google-site-verification],meta[name=facebook-domain-verification]').remove();
  $('*').each((i,e)=>{for(const key of Object.keys(e.attribs||{})){if(/^on/i.test(key)||key==='nonce'||key==='integrity')$(e).removeAttr(key);}
    const style=$(e).attr('style');if(style&&/opacity:\s*0(?:[;\s]|$)|visibility:\s*hidden/.test(style)&&!$(e).closest('header,[role=dialog],[role=tabpanel]').length){$(e).attr('style',style.replace(/(?:opacity|visibility|transform|translate|scale|clip-path)\s*:[^;]+;?/g,''));$(e).attr('data-local-reveal','');}
    if($(e).attr('href')?.startsWith('javascript:'))$(e).attr('href','#');
  });
  $('form').each((i,e)=>{$(e).removeAttr('action').removeAttr('method').attr('data-local-form','');});
  $('a[href]').each((i,e)=>{const href=$(e).attr('href');if(!href||href.startsWith('#')||/^(mailto:|tel:)/.test(href))return;
    try{const u=new URL(href,finalUrl),target=canonical(u.href);
      if(target){$(e).attr('href',localPath(target)+u.search+u.hash).attr('target','_top');}
      else $(e).attr('href',u.href).attr('target','_blank').attr('rel','noreferrer noopener');
    }catch{}
  });
  const jobs=[];
  $('a[href]').each((i,e)=>{const href=$(e).attr('href');if(/^https?:/.test(href||'')&&/\.(pdf|zip|json|csv)(?:[?#]|$)/i.test(href))jobs.push((async()=>{$(e).attr('href',await asset(href,finalUrl));})());});
  $('link[rel=stylesheet]').each((i,e)=>{jobs.push((async()=>{$(e).attr('href',await asset($(e).attr('href'),finalUrl));})());});
  $('img').each((i,e)=>{jobs.push((async()=>{
    const el=$(e);let src=el.attr('src');const set=el.attr('srcset');
    if(set){const options=set.split(/,\s*/).map(s=>s.trim().split(/\s+/)).filter(s=>s[0]);src=(options.filter(s=>parseInt(s[1])<=1920).at(-1)||options.at(-1))?.[0]||src;}
    el.removeAttr('srcset').removeAttr('sizes').removeAttr('data-nimg');
    if(src)el.attr('src',await asset(src,finalUrl));el.attr('loading','lazy');
  })());});
  $('video,audio,source').each((i,e)=>{jobs.push((async()=>{const el=$(e);if(el.attr('src'))el.attr('src',await asset(el.attr('src'),finalUrl));if(el.attr('poster'))el.attr('poster',await asset(el.attr('poster'),finalUrl));el.removeAttr('srcset');if(e.tagName==='video')el.attr('playsinline','').attr('muted','');})());});
  $('[style]').each((i,e)=>{const style=$(e).attr('style');const refs=[...style.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);if(refs.length)jobs.push((async()=>{let next=style;for(const ref of refs)next=next.split(ref).join(await asset(ref,finalUrl));$(e).attr('style',next);})());});
  // Limit concurrent page-asset operations; shared promises deduplicate CSS/fonts.
  await Promise.all(jobs);
  const localVideos=[];for(const ref of new Set(videoRefs.slice(0,12)))localVideos.push(await asset(ref,finalUrl));
  if(route==='/enterprise/healthcare'){
    const play=$('button').filter((i,e)=>($(e).attr('aria-label')||'').match(/play/i)||($(e).attr('class')||'').includes('bg-black/40'));
    const medical=videoRefs.find(v=>/Rad%20Agent|Rad Agent/i.test(v));
    const agentex=videoRefs.find(v=>/agentex/i.test(v));
    if(medical)play.eq(0).attr('data-local-video',await asset(medical,finalUrl));
    if(agentex)play.eq(1).attr('data-local-video',await asset(agentex,finalUrl));
  }
  const images=$('img[src]').map((i,e)=>$(e).attr('src')).get();
  $('iframe').each((i,e)=>{const src=$(e).attr('src')||'';if(!/youtube|vimeo/.test(src))$(e).replaceWith('<div data-local-embed></div>');});
  const meta={sourceUrl:url,finalUrl,title,description,localPath:route,family:type,headings,images:[...new Set(images)],videos:localVideos};
  $('html').attr('data-local-page',type);$('head').append('<meta name="local-source-url" content="'+url+'"><link rel="stylesheet" href="/site-runtime.css">');
  $('head').append('<meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: blob: https:; script-src \'self\'; style-src \'self\' \'unsafe-inline\' https:; connect-src \'self\'; form-action \'none\'; object-src \'none\'">');
  $('body').append('<script id="local-page-data" type="application/json">'+JSON.stringify(meta).replaceAll('<','\\u003c')+'</script><script src="/site-runtime.js" defer></script>');
  const file='/site-pages/'+id+'.html';await fs.writeFile(path.join(out,file),$.html());
  const content=$('main').text().replace(/\s+/g,' ').trim();
  return{sourceUrl:url,finalUrl,path:route,status,title,description,family:type,file,redirectTo:canonicalFinal&&localPath(canonicalFinal)!==route?localPath(canonicalFinal):undefined,links,headings,images:meta.images,videos:localVideos,sections:$('section').length,contentChars:content.length,fromCache};
}

const seed=new Set();
for(const f of await fs.readdir(path.join(evidence,'sitemaps'))){const text=await fs.readFile(path.join(evidence,'sitemaps',f),'utf8');for(const m of text.matchAll(/<loc>(.*?)<\/loc>/g)){const u=canonical(m[1].replaceAll('&amp;','&'));if(u)seed.add(u);}}
for(const u of ['https://scale.com/docs','https://scale.com/enterprise/agentic-solutions'])seed.add(u);
if(!process.argv.includes('--only')){
  const xmlQueue=['https://scale.com/sitemap.xml','https://labs.scale.com/sitemap.xml','https://brand.scale.com/sitemap.xml'],xmlSeen=new Set();
  while(xmlQueue.length){const url=xmlQueue.shift();if(xmlSeen.has(url))continue;xmlSeen.add(url);
    try{const response=await request(url);if(!response.ok)continue;const xml=await response.text();
      for(const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)){const link=m[1].replaceAll('&amp;','&');if(/\.xml(?:$|\?)/.test(link))xmlQueue.push(link);else{const page=canonical(link);if(page)seed.add(page);}}
    }catch(e){report.errors.push({stage:'sitemap',url,error:String(e)});}
  }
  report.sitemaps=[...xmlSeen];
}
try{
  const responses=await Promise.all(['jobs','departments','offices'].map(async name=>(await request('https://api.greenhouse.io/v1/boards/scaleai/'+name)).json()));
  const data={...responses[0],departments:responses[1].departments||[],offices:responses[2].offices||[]};
  for(const job of data.jobs||[]){job.departments=data.departments.filter(d=>(d.jobs||[]).some(j=>j.id===job.id)).map(d=>({id:d.id,name:d.name}));}
  await fs.writeFile(path.join(out,'site-careers.json'),JSON.stringify(data));
  for(const job of data.jobs||[])seed.add('https://scale.com/careers/'+job.id);
}catch(e){report.errors.push({stage:'careers API',error:String(e)});}
const only=process.argv.indexOf('--only');
const selected=only>=0?process.argv.slice(only+1).map(u=>canonical(u)).filter(Boolean):[...seed];
const queue=[...selected].filter(u=>localPath(u)!=='/'),seen=new Set(queue);
const max=2500;
async function checkpoint(){
  const byPath=new Map();for(const p of [...known.values(),...report.pages])if(p.path!=='/')byPath.set(p.path,p);
  const list=[...byPath.values()].sort((a,b)=>a.path.localeCompare(b.path));
  const manifest={version:1,updated:new Date().toISOString(),homepage:'approved React homepage preserved',pages:list};
  await fs.writeFile(path.join(out,'site-manifest.json'),JSON.stringify(manifest));
  await fs.writeFile(path.join(evidence,'site-crawl-report.json'),JSON.stringify({...report,assets:[...assetRecords.values()],queued:queue.length,seen:seen.size},null,2));
  await fs.writeFile(path.join(evidence,'asset-cache.json'),JSON.stringify([...assetRecords.values()]));
}
let finished=0;
await Promise.all(Array.from({length:4},async()=>{
  while(queue.length){const url=queue.shift();try{
    const page=await buildPage(url);report.pages.push(page);
    if(only<0)for(const link of page.links||[])if(localPath(link)!=='/'&&!seen.has(link)&&seen.size<max){seen.add(link);queue.push(link);}
    finished++;console.log(JSON.stringify({done:finished,pending:queue.length,path:page.path,status:page.status,sections:page.sections,bytes:page.contentChars}));
    if(finished%20===0)await checkpoint();
  }catch(e){report.errors.push({url,error:String(e)});console.log(JSON.stringify({url,error:String(e)}));}await wait(200);}
}));
await checkpoint();console.log(JSON.stringify({complete:true,pages:report.pages.length,errors:report.errors.length,assets:assetRecords.size}));
