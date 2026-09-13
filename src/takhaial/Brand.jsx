import "./brand.css";

// The original PNGs are unchanged. The SVG viewport excludes only transparent
// padding measured from their alpha channels, preserving every visible pixel.
export default function Brand({ stacked = false }) {
  return (
    <svg
      className={`tk-brand-logo${stacked ? " tk-brand-logo--stacked" : ""}`}
      viewBox={stacked ? "92 27 895 1025" : "0 399 1080 281"}
      role="img"
      aria-label="Takhaial Tech"
      focusable="false"
    >
      <image
        href={`/takhaial/brand/dark-${stacked ? "stacked" : "horizontal"}.png`}
        x="0"
        y="0"
        width="1080"
        height="1080"
      />
    </svg>
  );
}
