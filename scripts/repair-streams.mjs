import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import {resolveStreams} from './resolve-streams.mjs';
const root=process.cwd(),manifest=JSON.parse(await fs.readFile('public/site-manifest.json','utf8')),changes=[];
for(const page of manifest.pages){if(!page.file)continue;const file=path.join(root,'public',page.file),html=await fs.readFile(file,'utf8');if(!/id=["']S:/.test(html))continue;
 const $=load(html),count=resolveStreams($);
 if(count){await fs.writeFile(file,$.html());changes.push({path:page.path,boundaries:count});}
}
await fs.writeFile('.tasks/clone-scale.com/stream-repair-report.json',JSON.stringify({at:new Date().toISOString(),changes},null,2));
console.log(JSON.stringify({pages:changes.length,boundaries:changes.reduce((n,p)=>n+p.boundaries,0)}));
