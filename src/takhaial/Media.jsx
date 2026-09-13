import { useEffect, useRef, useState } from "react";
import { getMediaFrame } from "./mediaFraming";
export function Poster({ name, alt = "", className = "" }) {
  const frame = getMediaFrame(name);
  if (frame.hasCrop)
    return (
      <svg
        className={`tk-poster-crop ${className}`}
        viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={alt}
        focusable="false"
      >
        <image
          href={`/takhaial/media/${name}.webp`}
          width={frame.width}
          height={frame.height}
        />
      </svg>
    );
  return (
    <img
      className={className}
      src={`/takhaial/media/${name}.webp`}
      alt={alt}
      loading="lazy"
    />
  );
}
export function ProjectGallery({ name, title, count = 24 }) {
  const [index, setIndex] = useState(0);
  const file = (i) =>
    `/takhaial/media/${name}-${String(i + 1).padStart(2, "0")}.webp`;
  return (
    <div className="tk-gallery">
      <img
        className="tk-gallery-main"
        src={file(index)}
        alt={`${title} — process image ${index + 1}`}
      />
      <div className="tk-gallery-controls">
        <button
          aria-label="Previous project image"
          onClick={() => setIndex((i) => (i + count - 1) % count)}
        >
          ←
        </button>
        <p aria-live="polite">
          Image {index + 1} of {count} · Original project process
        </p>
        <button
          aria-label="Next project image"
          onClick={() => setIndex((i) => (i + 1) % count)}
        >
          →
        </button>
      </div>
      <div
        className="tk-gallery-thumbs"
        role="group"
        aria-label="Project process images"
      >
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            aria-label={`Show project image ${i + 1}`}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <img src={file(i)} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
export default function Media({ name, title, hasVideo = true, actionLabel = "Watch project film" }) {
  const videoSource = import.meta.env.VITE_PUBLIC_PREVIEW === "true" && name === "lexus-vr-showroom"
    ? "https://takhaial-production-5158.up.railway.app/v1/sections/media/video-1779632922381.mkv"
    : `/takhaial/media/${name}.mp4`;
  const [open, setOpen] = useState(false),
    [fullFrame, setFullFrame] = useState(false),
    dialog = useRef(null),
    video = useRef(null);
  const frame = getMediaFrame(name, fullFrame);
  useEffect(() => {
    const element = video.current;
    if (open) {
      dialog.current?.showModal();
      element?.play().catch(() => {});
    } else dialog.current?.close();
    return () => element?.pause();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [open]);
  if (!hasVideo)
    return (
      <figure className="tk-media">
        <Poster name={name} alt={title} />
        <figcaption>{title}</figcaption>
      </figure>
    );
  return (
    <>
      <button
        className="tk-media tk-media-button"
        onClick={() => {
          setFullFrame(false);
          setOpen(true);
        }}
        aria-label={`Play ${title}`}
      >
        <Poster name={name} alt={title} />
        <span className="tk-play">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 5 11 7-11 7Z" />
          </svg>
        </span>
        <span className="tk-media-caption">
          {actionLabel} <span>↗</span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="tk-video-dialog"
        style={{
          "--tk-media-ratio": frame.ratio,
          "--tk-media-position": frame.position,
        }}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false);
        }}
      >
        <div className="tk-video-shell">
          <header>
            <p>{title}</p>
            {frame.hasCrop && (
              <button
                className="tk-video-fit"
                type="button"
                aria-pressed={fullFrame}
                onClick={() => setFullFrame((value) => !value)}
              >
                {fullFrame ? "Fill frame" : "Show full recording"}
              </button>
            )}
            <button onClick={() => setOpen(false)} aria-label="Close video">
              ×
            </button>
          </header>
          {open && (
            <div className="tk-video-stage">
              <video
                ref={video}
                src={videoSource}
                poster={`/takhaial/media/${name}.webp`}
                controls
                autoPlay
                playsInline
                preload="metadata"
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
