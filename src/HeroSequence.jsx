import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createHeroRenderer } from "./heroRenderer";
import "./hero-sequence.css";

/* Three plain steps. A visitor should be able to say what we do, how we start
   and what it costs them to find out, without decoding a metaphor. */
const content = {
  reliability: {
    category: "Step one",
    title: "We map how the work moves today.",
    body: "A short engagement with the people doing the job: where requests wait, what gets re-typed, and what the delay is costing.",
  },
  applications: {
    category: "Step two",
    title: "We build one system that handles it.",
    body: "A working application for that one process, connected to the tools you already run. Not a platform you have to move your company into.",
    href: "/services", cta: "See what we build",
  },
  data: {
    category: "Step three",
    title: "You see the numbers before you commit.",
    body: "We measure the result against how the process ran before — hours, errors, response time — and the commercial agreement comes after that.",
    href: "/approach", cta: "How we work",
  },
};

function RevealWords({ text, className = "", as: Tag = "span" }) {
  const words=text.split(" "), measure=useRef(null), container=useRef(null);
  const [lines,setLines]=useState([words.map((_,i)=>i)]);
  useLayoutEffect(()=>{
    let frame=0,disposed=false;
    const split=()=>{
      frame=0;if(disposed||!measure.current)return;
      const next=[];let top=-Infinity;
      [...measure.current.children].forEach((word,i)=>{
        if(Math.abs(word.offsetTop-top)>1)next.push([]);
        next[next.length-1].push(i);top=word.offsetTop;
      });
      if(next.length)setLines(current=>JSON.stringify(current)===JSON.stringify(next)?current:next);
    };
    const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(split);};
    const observer=new ResizeObserver(schedule);observer.observe(container.current);
    document.fonts.ready.then(schedule);split();
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();};
  },[text]);
  return <Tag ref={container} className={`source-reveal ${className}`} aria-label={text}>
    <span ref={measure} className="source-reveal__measure" aria-hidden="true">{words.map((word,i)=><Fragment key={i}><span>{word}</span>{" "}</Fragment>)}</span>
    {lines.map((line,lineIndex)=><span className="source-reveal__clip" key={lineIndex} aria-hidden="true">
      <span className="source-reveal__line" style={{"--line":lineIndex}}>{line.map((index,i)=><Fragment key={index}><span className="source-reveal__word" style={{"--word":index,"--line-word":i,"--line":lineIndex,"--word-count":words.length}}>{words[index]}</span>{i<line.length-1?" ":null}</Fragment>)}</span>
    </span>)}
  </Tag>;
}

export default function HeroSequence({ SmartLink, title, description }) {
  const root = useRef(null), canvas = useRef(null), stage = useRef(null), fallbackVideo = useRef(null);
  const [phase,setPhase] = useState("opening");
  const [reverse,setReverse] = useState(false);
  const [failed,setFailed] = useState(false);
  const [reduced,setReduced] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();query.addEventListener("change",update);
    return () => query.removeEventListener("change",update);
  },[]);
  useEffect(() => {
    if(reduced || failed) return;
    let cleanup;
    // No second argument: the opening is rendered live rather than sampled
    // from the packed film, so it is sharp at any size and never cropped.
    try { cleanup = createHeroRenderer(canvas.current,null,(next,direction)=>{setPhase(next);setReverse(direction<0);}); }
    catch (error) { setFailed(true); console.warn("Hero renderer unavailable; showing Takhaial video fallback.",error); }
    return () => cleanup?.();
  },[reduced,failed]);
  useEffect(() => {
    const fallback = fallbackVideo.current;
    if (!failed || reduced || !fallback) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) fallback.play().catch(() => {});
      else fallback.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(fallback);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("pointerdown", sync, { passive: true });
    return () => {
      observer.disconnect();
      fallback.pause();
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("pointerdown", sync);
    };
  },[failed,reduced]);
  useEffect(() => {
    let frame=0;
    const update=()=>{
      const top=root.current.getBoundingClientRect().top+scrollY;
      const end=innerHeight*(innerWidth<=768?2.32:4.5);
      const flowHeight=innerHeight*(innerWidth<768?2.32:4.5);
      root.current.style.height=`${Math.max(innerHeight,end-top+innerHeight)}px`;
      root.current.style.marginBottom=`${top-innerHeight+flowHeight-end}px`;
      const p=Math.max(0,Math.min(1,(scrollY-top)/(end-top)));
      const q=Math.max(0,Math.min(1,(p-.8)/.2));
      const e=q<.5?4*q*q*q:1-(-2*q+2)**3/2;
      stage.current.style.transform=`translate3d(0,${-10*e}%,0)`;
      if(failed) setPhase(scrollY<innerHeight*.1?"opening":scrollY<innerHeight*1.41?"reliability":scrollY<innerHeight*2.82?"applications":"data");
      frame=0;
    };
    const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener("scroll",request,{passive:true});window.addEventListener("resize",request);
    const obs=new ResizeObserver(request);obs.observe(document.querySelector('.announcement')||root.current);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",request);window.removeEventListener("resize",request);obs.disconnect();};
  },[failed]);
  return <section ref={root} id="story" className={`source-hero${reduced?" source-hero--reduced":""}${failed?" source-hero--fallback":""}`} data-phase={phase} data-direction={reverse?"reverse":"forward"} aria-labelledby="hero-title">
    <div className="source-hero__pin">
      <div ref={stage} className="source-hero__stage">
        <div className="source-hero__poster" aria-hidden="true" />
        <canvas ref={canvas} className="source-hero__canvas" data-testid="hero-video-canvas" aria-hidden="true" />
        {failed && !reduced && <video ref={fallbackVideo} className="source-hero__fallback" src="/takhaial/media/ai-cinematic-loop.mp4" poster="/takhaial/media/ai-cinematic-poster.webp" autoPlay muted playsInline loop preload="auto" aria-hidden="true" tabIndex={-1}/>}
        <div className="source-hero__opening" aria-hidden={phase!=="opening"&&!reduced} inert={phase!=="opening"&&!reduced?true:undefined}>
          <div className="source-hero__opening-content">
            <h1 id="hero-title">{title||<>Custom AI and automation<br/>for your operation.</>}</h1>
            <p className="source-hero__opening-body">{description||'We build one process properly — document handling, safety monitoring, enquiry response, reporting — and connect it to the systems you already use.'}</p>
            <SmartLink href="/contact" className="source-hero__cta source-hero__cta--opening">Talk to our team<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg></SmartLink>
          </div>
          <button className="source-hero__scroll" type="button" onClick={()=>window.scrollTo({top:innerHeight*.65,behavior:"smooth"})} tabIndex={phase==='opening'?0:-1}>
            <span>Scroll to explore</span><span className="source-hero__arrow">↓</span>
          </button>
        </div>
        {Object.entries(content).map(([key,value])=><div key={key} className={`source-hero__copy source-hero__copy--${key}`} data-active={phase===key||reduced} aria-hidden={phase!==key&&!reduced} inert={phase!==key&&!reduced?true:undefined}>
          {value.category&&<RevealWords text={value.category} as="p" className="source-hero__category"/>}
          <RevealWords text={value.title} as="h2" className="source-hero__heading"/>
          <RevealWords text={value.body} as="p" className="source-hero__body"/>
          {value.cta&&<SmartLink href={value.href} className="source-hero__cta">{value.cta}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg></SmartLink>}
        </div>)}
      </div>
    </div>
  </section>;
}
