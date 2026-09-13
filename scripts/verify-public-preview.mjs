import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pageList} from '../src/takhaial/content.js';
const root=path.resolve('../takhaial-public-preview/out');
let count=0,bytes=0;
async function inspect(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name),relative=path.relative(root,file);
 assert.ok(!entry.isSymbolicLink(),relative+' cannot be a symlink');
 assert.doesNotMatch(relative,/(^|[\\/])(\.env[^\\/]*|\.local|\.git|\.tasks|node_modules)([\\/]|$)|credentials|\.log$|\.map$/i);
 if(entry.isDirectory()){await inspect(file);continue;}
 assert.match(entry.name,/\.(html|js|css|json|txt|webp|png|jpg|jpeg|svg|woff2?|ttf|mp4|ico)$/i);
 const stat=await fs.stat(file);assert.ok(stat.size<=25*1024*1024,relative+' exceeds static-host limit');count++;bytes+=stat.size;
 if(/\.(js|html|json|css|txt)$/.test(file)){
  const body=await fs.readFile(file,'utf8');
  assert.doesNotMatch(body,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}|\bgh[pousr]_[A-Za-z0-9]{30,}/,relative+' has a secret-like pattern');
  if(file.endsWith('.js')){
   assert.doesNotMatch(body,/\/api\/takhaial|setupRequired|scrypt|Sign in to edit|Set up the local studio/,relative+' contains local admin logic');
  }
 }
}}
await inspect(root);
const html=await fs.readFile(path.join(root,'index.html'),'utf8');assert.match(html,/noindex/);
const bundle=await fs.readdir(path.join(root,'assets'));assert.ok(!bundle.some(x=>/^Admin-/.test(x)));
for(const route of pageList){const out=route.path==='/'?root:path.join(root,route.path);await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'index.html'),html);}
console.log(JSON.stringify({files:count,bytes,publicRoutes:pageList.length,adminExcluded:true,secretPatternScan:'passed',routeEntrypoints:'created'},null,2));
