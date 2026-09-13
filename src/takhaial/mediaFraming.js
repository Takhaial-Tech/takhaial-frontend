// Measured at five intervals per film. These windows remove baked borders,
// not the white tablet presentation or intentional end-card backgrounds.
export const mediaFrames = {
  "automotive-vr": { size: [1280, 720] },
  "lexus-ar": { size: [1152, 720] },
  "heritage-vr": { size: [1280, 720], content: [280, 0, 720, 720] },
  "mixed-reality-surgery": { size: [1280, 720], content: [0, 14, 1280, 690] },
  "oil-sector-ar": { size: [720, 720] },
  "product-validation": { size: [1280, 720], content: [200, 0, 880, 720] },
  "real-estate-vr": { size: [1280, 720], content: [280, 0, 720, 720] },
  "safety-training": { size: [1280, 720] },
  "snow-environment": { size: [1920, 1012] },
  "the-hell-draft": { size: [1920, 1012], content: [0, 32, 1920, 948] },
  "3d-to-ai-jaguar": { size: [960, 540] },
  "automation-loop": { size: [1920, 1080] },
};
export function getMediaFrame(name, full = false) {
  const source = mediaFrames[name] || { size: [16, 9] };
  const [width, height] = source.size;
  const [x, y, w, h] =
    !full && source.content ? source.content : [0, 0, width, height];
  const positionX = width === w ? 50 : (x / (width - w)) * 100;
  const positionY = height === h ? 50 : (y / (height - h)) * 100;
  return {
    width,
    height,
    x,
    y,
    w,
    h,
    ratio: w / h,
    position: `${positionX}% ${positionY}%`,
    hasCrop: !!source.content,
  };
}
