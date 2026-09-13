import {useEffect,useMemo,useState} from 'react';
import './site-routes.css';

export function localLink(href){
  if(!/^https?:\/\//.test(href||''))return href;
  try{const u=new URL(href);let prefix='';
    if(u.hostname==='labs.scale.com')prefix='/labs';
    else if(u.hostname==='brand.scale.com')prefix='/brand';
    else if(u.hostname==='api-reference.scale.com')prefix='/api-reference';
    else if(!['scale.com','www.scale.com'].includes(u.hostname))return href;
    return prefix+(u.pathname==='/'?(prefix?'':'/'):u.pathname)+u.search+u.hash;
  }catch{return href;}
}

export default function SiteRoutes({pathname}){
  const [manifest,setManifest]=useState(null),[error,setError]=useState(false);
  useEffect(()=>{let active=true;fetch('/site-manifest.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{if(active)setManifest(data);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[]);
  const entry=useMemo(()=>manifest?.pages.find(p=>p.path===pathname||p.path===decodeURI(pathname)),[manifest,pathname]);
  useEffect(()=>{if(entry?.title)document.title=entry.title;if(entry?.redirectTo&&entry.redirectTo!==pathname)window.location.replace(entry.redirectTo+location.search+location.hash);},[entry,pathname]);
  if(pathname==='/site-index')return <SiteDirectory manifest={manifest}/>;
  if(!manifest&&!error)return <div className="site-route-loading" role="status">Loading page…</div>;
  if(!entry?.file)return <div className="site-route-missing"><a href="/">← Home</a><h1>{entry?.title||'Page not available'}</h1><p>{entry?'The source page is currently unavailable.':'This address is not in the current public page inventory.'}</p><a href="/site-index">Browse all pages →</a>{entry?.sourceUrl&&<a href={entry.sourceUrl} target="_blank" rel="noreferrer">Open original page ↗</a>}</div>;
  return <iframe key={entry.file} className="site-route-frame" title={entry.title} src={entry.file+location.search+location.hash} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-top-navigation-by-user-activation" allow="autoplay; fullscreen; clipboard-write"/>;
}

function SiteDirectory({manifest}){
  const [query,setQuery]=useState(''),[family,setFamily]=useState('all');
  const pages=manifest?.pages||[],families=[...new Set(pages.map(p=>p.family))].sort();
  const shown=pages.filter(p=>(family==='all'||p.family===family)&&(!query||[p.title,p.path,p.description].join(' ').toLowerCase().includes(query.toLowerCase())));
  return <main className="site-directory"><header><a href="/">← Homepage</a><div><h1>Explore the site</h1><p>{manifest?`${pages.length} routes · ${pages.filter(p=>p.file).length} captured · ${pages.filter(p=>!p.file).length} unavailable on the source`:'Loading the site inventory…'}</p></div></header><div className="site-directory__filters"><input aria-label="Search site pages" placeholder="Search by page title, topic or address…" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Page category" value={family} onChange={e=>setFamily(e.target.value)}><option value="all">All categories</option>{families.map(f=><option key={f}>{f}</option>)}</select><span>{shown.length} results</span></div><div className="site-directory__list">{shown.map(p=><a key={p.path} href={p.path}><small>{p.family}{!p.file?' · Source unavailable':p.redirectTo?' · Redirect':''}</small><h2>{p.title.replace(/\s*\|\s*Scale.*$/,'')}</h2><p>{p.description}</p><span>{p.path} →</span></a>)}</div></main>;
}
