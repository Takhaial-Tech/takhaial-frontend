import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(), publicRoot=path.join(root,'public');
const cacheFile=path.join(root,'.tasks/clone-scale.com/asset-cache.json');
const records=JSON.parse(await fs.readFile(cacheFile,'utf8'));
const changes=[];
for(const record of records.filter(r=>r.reason==='large media streams from original CDN')){
  const response=await fetch(record.url,{signal:AbortSignal.timeout(180000)});
  if(!response.ok)throw new Error(`${response.status} ${record.url}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  const local='/site-assets/'+crypto.createHash('sha256').update(record.url).digest('hex').slice(0,20)+'.mp4';
  await fs.writeFile(path.join(publicRoot,local),bytes);
  changes.push({url:record.url,local});
  Object.assign(record,{local,bytes:bytes.length,mime:'video/mp4'});delete record.reason;
  console.log(JSON.stringify({local,bytes:bytes.length}));
}
for(const folder of ['site-pages','site-assets']){
 for(const filename of await fs.readdir(path.join(publicRoot,folder))){
  if(!/\.(html|css|json)$/.test(filename))continue;
  const target=path.join(publicRoot,folder,filename),before=await fs.readFile(target,'utf8');let after=before;
  for(const item of changes)after=after.split(item.url).join(item.local);
  if(after!==before)await fs.writeFile(target,after);
 }
}
const manifestFile=path.join(publicRoot,'site-manifest.json');
const manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));
for(const page of manifest.pages)page.videos=page.videos?.map(url=>changes.find(c=>c.url===url)?.local||url);
await fs.writeFile(manifestFile,JSON.stringify(manifest));
await fs.writeFile(cacheFile,JSON.stringify(records));
console.log(JSON.stringify({downloaded:changes.length}));
