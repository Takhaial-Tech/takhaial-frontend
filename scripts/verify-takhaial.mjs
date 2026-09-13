import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {renderToString} from 'react-dom/server';
import {createElement} from 'react';
import {load} from 'cheerio';
import {createServer} from 'vite';
import {pageList,projects} from '../src/takhaial/content.js';
import {normalisePath} from '../src/takhaial/routing.js';

// Server-rendered contract checks; deliberately not a substitute for browser visual QA.
const root=process.cwd(),server=await createServer({root,server:{middlewareMode:true,watch:null},appType:'custom'});
const errors=[],results=[],routes=new Set(pageList.map(p=>p.path));
globalThis.location={pathname:'/',search:'',href:'http://127.0.0.1:4173/'};
try{
 const {RoutedPage,default:TakhaialApp}=await server.ssrLoadModule('/src/TakhaialApp.jsx');
 for(const page of pageList){
  const html=renderToString(RoutedPage({path:page.path,settings:{}}));const $=load(html);
  const body=$('body').text().replace(/\s+/g,' ').trim();
  if(!$('h1').length)errors.push(page.path+': missing h1');
  if(body.length<200)errors.push(page.path+': thin content');
  if(/\bScale\b|Donovan|Mayo Clinic|Data Engine|90%|25%|founder|co-founder/.test(body))errors.push(page.path+': inherited or disallowed copy');
  for(const el of $('a[href]').toArray()){
   const href=$(el).attr('href');if(href.startsWith('/')&&!routes.has(href.split(/[?#]/)[0]))errors.push(page.path+': missing internal route '+href);
   if(href.startsWith('#')&&!$(href).length&&href!=='#top')errors.push(page.path+': missing anchor '+href);
  }
  for(const el of $('img[src],video[src]').toArray()){
   const src=$(el).attr('src');if(!src.startsWith('/'))continue;
   try{await fs.access(path.join(root,'public',src));}catch{errors.push(page.path+': missing asset '+src);}
  }
  results.push({path:page.path,title:$('h1').first().text(),chars:body.length,links:$('a[href]').length});
 }
 const training=load(renderToString(RoutedPage({path:'/industries/workforce-training',settings:{}})));
 const home=load(renderToString(RoutedPage({path:'/',settings:{}})));
 const featured=home('.tk-featured-work');
 assert.equal(featured.children().length,3);
 assert.equal(featured.children().first().find('h3').text().trim(),'Lexus VR Showroom');
 assert.equal(featured.find('button[aria-label="Play Lexus VR Showroom"]').length,1);
 assert.match(featured.text(),/Watch Lexus VR trailer/);
 assert.deepEqual(featured.find('a[href]').toArray().map(el=>home(el).attr('href')),['/work/lexus-vr-showroom','/work/lexus-ar-experience','/work/heritage-spatial-experience']);
 assert.doesNotMatch(featured.text(),/Jaguar|Hell Draft|Bloody Snow/);
 if(training('.tk-workflow__tabs button[aria-pressed="true"]').text()!=='Guided experiences')errors.push('Training industry must initially show its own guided-experience workflow, not a sales fallback');
 const shell=load(renderToString(createElement(TakhaialApp)));
 for(const el of shell('header a[href],footer a[href]').toArray()){
  const href=shell(el).attr('href');
  if(href.startsWith('/')&&!routes.has(href.split(/[?#]/)[0]))errors.push('Shell missing route '+href);
  if(/\/(studio|login|signup|dashboard)(?:$|[/?#])/.test(href))errors.push('Private/account entry present in public navigation');
 }
 for(const invalid of ['/%','/%E0%A4%A','/work/%ZZ'])assert.equal(normalisePath(invalid),'/invalid-address');
 assert.equal(normalisePath('/work/'),'/work');
 for(const p of projects.filter(p=>p.slug!=='ai-unity-vr'&&!p.imageOnly))await fs.access(path.join(root,'public/takhaial/media',p.media+'.mp4')).catch(()=>errors.push('Missing project video '+p.slug));
 const missing=load(renderToString(RoutedPage({path:'/data-engine',settings:{}})));
 assert.match(missing('h1').text(),/isn’t part/);
 const overridden=load(renderToString(RoutedPage({path:'/',settings:{heroTitle:'Verified override',heroDescription:'Verified description'}})));
 assert.equal(overridden('h1').text(),'Verified override');
 assert.equal(overridden('.source-hero__opening-body').text(),'Verified description');
 const dirs=await fs.readdir(path.join(root,'public'));
 assert.equal(dirs.some(p=>/^site-|^images$|^videos$|^icons$/.test(p)),false,'Legacy asset folders must not be served');
 const result={at:new Date().toISOString(),kind:'SSR contract and local asset audit — no browser visual claim',routes:results.length,errors,results};
 await fs.writeFile(path.join(root,'../takhaial-site-evidence/route-audit.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({routes:result.routes,errors},null,2));
 if(errors.length)process.exitCode=1;
}finally{await server.close();delete globalThis.location;}
