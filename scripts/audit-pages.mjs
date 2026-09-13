import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
const root=process.cwd(),publicRoot=path.join(root,'public');
const manifest=JSON.parse(await fs.readFile(path.join(publicRoot,'site-manifest.json'),'utf8'));
const routes=new Set(['/', '/site-index',...manifest.pages.map(p=>p.path)]);
const missingFiles=[],missingLinks=[],badScripts=[],forms=[],pages=[],unresolvedStreams=[],buttons=new Map();
for(const page of manifest.pages){
 if(!page.file)continue;
 let html;try{html=await fs.readFile(path.join(publicRoot,page.file),'utf8');}catch{missingFiles.push(page.file);continue;}
 const $=load(html);
 for(const e of $('[hidden][id^="S:"]').toArray())unresolvedStreams.push({path:page.path,id:$(e).attr('id')});
 for(const e of $('script').toArray()){const src=$(e).attr('src');if(src&&src!=='/site-runtime.js')badScripts.push({path:page.path,src});if(!src&&$(e).attr('type')!=='application/json')badScripts.push({path:page.path,inline:true});}
 for(const e of $('form[action]').toArray())forms.push({path:page.path,action:$(e).attr('action')});
 for(const e of $('[src],link[rel=stylesheet]').toArray()){const src=$(e).attr('src')||$(e).attr('href');if(src?.startsWith('/site-assets/')){try{await fs.access(path.join(publicRoot,src));}catch{missingFiles.push(src);}}}
 for(const e of $('a[href]').toArray()){
  const href=$(e).attr('href');if(!href?.startsWith('/')||href.startsWith('//')||href.startsWith('/site-assets/'))continue;
  const target=decodeURI(href.split(/[?#]/)[0]).replace(/\/+$/,'')||'/';
  if(!routes.has(target)&&!target.match(/\.[a-z0-9]{2,5}$/i))missingLinks.push({from:page.path,to:target});
 }
 for(const e of $('button').toArray()){
  const label=($(e).attr('aria-label')||$(e).text()).replace(/\s+/g,' ').trim().slice(0,100);
  const key=label||'(icon only)';const value=buttons.get(key)||{label:key,count:0,examples:[]};value.count++;if(value.examples.length<3)value.examples.push(page.path);buttons.set(key,value);
 }
 const body=$('body').clone();body.find('header,footer,nav,script,style').remove();
 pages.push({path:page.path,headings:$('h1,h2,h3').length,contentChars:body.text().replace(/\s+/g,' ').trim().length,images:$('img').length,forms:$('form').length,buttons:$('button').length,sourceStatus:page.status});
}
const result={at:new Date().toISOString(),routes:manifest.pages.length,rendered:pages.length,sourceUnavailable:manifest.pages.filter(p=>p.status!==200).map(p=>({path:p.path,status:p.status})),missingFiles:[...new Set(missingFiles)],missingLinks,badScripts,externalFormActions:forms,unresolvedStreams,thinPages:pages.filter(p=>p.contentChars<100),pages,buttons:[...buttons.values()].sort((a,b)=>b.count-a.count)};
await fs.writeFile(path.join(root,'.tasks/clone-scale.com/site-audit.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({routes:result.routes,rendered:result.rendered,missingFiles:result.missingFiles.length,missingLinks:result.missingLinks.length,badScripts:badScripts.length,externalFormActions:forms.length,unresolvedStreams:unresolvedStreams.length,thin:result.thinPages,unavailable:result.sourceUnavailable.length},null,2));
