export function createAlienBackdrop(canvas) {
  const context = canvas?.getContext("2d");
  if (!context) return { refresh() {} };

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tile = document.createElement("canvas");
  tile.width = tile.height = 256;
  const ink = tile.getContext("2d");
  if (!ink) return { refresh() {} };

  const head = new Path2D("M0-35C23-35 37-21 33-3C30 15 10 37 0 40C-10 37-30 15-33-3C-37-21-23-35 0-35Z");
  const leftEye = new Path2D("M-26-6C-17-11-7-4-5 9C-16 12-25 4-26-6Z");
  const rightEye = new Path2D("M26-6C17-11 7-4 5 9C16 12 25 4 26-6Z");
  function face(x, y, rotation, scale) {
    ink.save();
    ink.translate(x, y);
    ink.rotate(rotation);
    ink.scale(scale, scale);
    ink.fillStyle = "#152d20";
    ink.strokeStyle = "#64956f";
    ink.lineWidth = 1.5;
    ink.fill(head);
    ink.stroke(head);
    ink.fillStyle = "#020704";
    ink.strokeStyle = "#3c6d48";
    ink.fill(leftEye);
    ink.stroke(leftEye);
    ink.fill(rightEye);
    ink.stroke(rightEye);
    ink.strokeStyle = "#56835e";
    ink.beginPath();
    ink.moveTo(-5, 24);
    ink.quadraticCurveTo(0, 27, 5, 24);
    ink.moveTo(-2, 16);
    ink.lineTo(-1, 18);
    ink.moveTo(2, 16);
    ink.lineTo(1, 18);
    ink.stroke();
    ink.restore();
  }
  face(64, 60, -0.14, 0.84);
  face(192, 188, 0.18, 0.77);
  const pattern = context.createPattern(tile, "repeat");
  if (!pattern) return { refresh() {} };

  let width = 0;
  let height = 0;
  let frame = 0;
  const pointer = { x: 0, y: 0, visible: false };
  const enabled = () => finePointer.matches && !reducedMotion.matches
    && !document.body.classList.contains("effects-off");

  function paint() {
    frame = 0;
    context.clearRect(0, 0, width, height);
    if (!enabled() || !pointer.visible || document.hidden) return;

    const radius = 190;
    const left = Math.max(0, pointer.x - radius);
    const top = Math.max(0, pointer.y - radius);
    const right = Math.min(width, pointer.x + radius);
    const bottom = Math.min(height, pointer.y + radius);
    if (right <= left || bottom <= top) return;

    context.save();
    const offset = window.scrollY % tile.height;
    context.translate(0, -offset);
    context.globalAlpha = 0.65;
    context.fillStyle = pattern;
    context.fillRect(left, top + offset, right - left, bottom - top);
    context.restore();

    const beam = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    beam.addColorStop(0, "rgba(255,255,255,.85)");
    beam.addColorStop(0.35, "rgba(255,255,255,.72)");
    beam.addColorStop(0.72, "rgba(255,255,255,.24)");
    beam.addColorStop(1, "rgba(255,255,255,0)");
    context.globalCompositeOperation = "destination-in";
    context.fillStyle = beam;
    context.fillRect(left, top, right - left, bottom - top);

    const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    glow.addColorStop(0, "rgba(111,196,132,.045)");
    glow.addColorStop(0.65, "rgba(74,142,87,.018)");
    glow.addColorStop(1, "rgba(74,142,87,0)");
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = glow;
    context.fillRect(left, top, right - left, bottom - top);
    context.globalCompositeOperation = "source-over";
  }
  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(paint);
  }
  function hide() {
    pointer.visible = false;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    context.clearRect(0, 0, width, height);
  }
  function refresh() {
    if (!enabled()) {
      hide();
      canvas.width = canvas.height = 1;
      return;
    }
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  }

  // Coordinates remain in memory; only a single paint is queued per frame.
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !enabled()) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.visible = true;
    schedule();
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", hide);
  window.addEventListener("blur", hide);
  document.addEventListener("visibilitychange", () => { if (document.hidden) hide(); });
  window.addEventListener("scroll", () => { if (pointer.visible) schedule(); }, { passive: true });
  window.addEventListener("resize", refresh, { passive: true });
  finePointer.addEventListener("change", refresh);
  reducedMotion.addEventListener("change", refresh);
  refresh();
  return { refresh };
}
