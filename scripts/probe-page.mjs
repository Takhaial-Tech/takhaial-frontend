import { load } from 'cheerio';
const url=process.argv[2]||'https://scale.com/enterprise/healthcare';
const response=await fetch(url);
const html=await response.text();
const $=load(html);
console.log(JSON.stringify({url:response.url,status:response.status,bytes:html.length,title:$('title').text(),
  sections:$('section').length,headings:$('h1,h2,h3').map((i,e)=>$(e).text()).get().slice(0,25),
  styles:$('link[rel=stylesheet]').map((i,e)=>$(e).attr('href')).get(),
  main:$('main').first().html()?.slice(0,1600),
  controls:$('button,[role=tab],[role=tabpanel],details,summary,form').map((i,e)=>({tag:e.tagName,text:$(e).text().slice(0,100),class:$(e).attr('class'),role:$(e).attr('role'),controls:$(e).attr('aria-controls')})).get().slice(0,35)
},null,2));
