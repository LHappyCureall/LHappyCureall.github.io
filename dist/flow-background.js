(() => {
  'use strict';
  const canvas = document.querySelector('#flow-background');
  const toggle = document.querySelector('#background-toggle');
  const context = canvas?.getContext('2d');
  if (!context || !toggle) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceKey = 'haochen-homepage-background-motion';
  let preference;
  try { preference = localStorage.getItem(preferenceKey); } catch (_) { /* Storage is optional. */ }
  let paused = reducedMotion.matches || preference === 'paused';
  let width = 0, height = 0;
  let animationFrame = 0, previousTime = 0, elapsed = 0;
  const strength = .65;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, influence: 0 };

  function glow(x, y, radius, color) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color},.17)`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    context.globalAlpha = strength;
    glow(width * .06, height * .35, width * .65, '74,169,183');
    glow(width * .96, height * .82, width * .5, '95,125,197');
    const lines = Math.ceil(height / 28) + 8;
    const radius = Math.min(240, width * .3);
    for (let row = -4; row < lines; row++) {
      context.beginPath();
      context.strokeStyle = row % 4 === 0 ? 'rgba(38,111,140,.62)' : 'rgba(83,143,162,.38)';
      context.lineWidth = row % 4 === 0 ? 1.15 : .8;
      for (let x = -30; x <= width + 30; x += 12) {
        const baseY = row * 28 + 24 * Math.sin(x / 255 + elapsed * .20 + row * .15)
          + 38 * Math.sin(x / 570 - elapsed * .12 + row * .10);
        const dx = x - pointer.x, dy = baseY - pointer.y;
        const weight = Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius));
        const y = baseY + weight * dy * .48 * pointer.influence;
        if (x === -30) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    }
    context.globalAlpha = 1;
  }

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!pointer.active) {
      pointer.x = pointer.targetX = width * .73;
      pointer.y = pointer.targetY = height * .45;
    }
    draw();
  }

  function frame(now) {
    animationFrame = 0;
    if (paused || document.hidden) return;
    if (!previousTime) previousTime = now;
    const dt = Math.min((now - previousTime) / 1000, .1);
    // Cap drawing near 30 fps and ease pointer movement independently of refresh rate.
    if (dt >= 1 / 32) {
      previousTime = now;
      elapsed += dt;
      const smoothing = 1 - Math.exp(-dt * 7);
      pointer.x += (pointer.targetX - pointer.x) * smoothing;
      pointer.y += (pointer.targetY - pointer.y) * smoothing;
      pointer.influence += ((pointer.active ? 1 : 0) - pointer.influence) * smoothing;
      draw();
    }
    animationFrame = requestAnimationFrame(frame);
  }

  function syncAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    previousTime = 0;
    toggle.querySelector('[lang="en"]').textContent = paused ? 'Play background' : 'Pause background';
    toggle.querySelector('[lang="zh-CN"]').textContent = paused ? '播放背景' : '暂停背景';
    if (!paused && !document.hidden) animationFrame = requestAnimationFrame(frame);
  }

  function move(event) {
    if (paused) return;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    preference = paused ? 'paused' : 'playing';
    try { localStorage.setItem(preferenceKey, preference); } catch (_) { /* Keep the in-memory choice. */ }
    syncAnimation();
  });
  window.addEventListener('pointermove', move, {passive: true});
  window.addEventListener('pointerdown', move, {passive: true});
  window.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') pointer.active = false; }, {passive: true});
  window.addEventListener('pointercancel', () => { pointer.active = false; });
  document.documentElement.addEventListener('pointerleave', () => { pointer.active = false; });
  window.addEventListener('blur', () => { pointer.active = false; });
  window.addEventListener('resize', resize, {passive: true});
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener('change', event => {
    paused = event.matches || preference === 'paused';
    syncAnimation();
  });
  resize();
  toggle.hidden = false;
  syncAnimation();
})();
