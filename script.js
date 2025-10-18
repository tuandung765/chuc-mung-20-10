/* ---------------- script.js ----------------
   Kết hợp nhiều hiệu ứng:
   - Intro -> App
   - Typewriter
   - Starfield (DOM)
   - Bokeh (DOM)
   - Stage images ziczac
   - Hearts emitter (sin path)
   - Confetti emitter
   - Firework simple particles
   - Butterfly flight
   - Music toggle, share, download
   - Ripple on click
------------------------------------------------ */

(() => {
  // Elements
  const intro = document.getElementById('intro');
  const introStart = document.getElementById('intro-start');
  const startBtn = document.getElementById('start-btn');
  const app = document.getElementById('app');
  const musicToggle = document.getElementById('music-toggle');
  const shareBtn = document.getElementById('share-btn');
  const reduceCheckbox = document.getElementById('reduce-motion');

  const bgAudio = document.getElementById('bg-audio');
  const typewriterEl = document.getElementById('typewriter');
  const heartsLayer = document.getElementById('hearts-layer');
  const confettiContainer = document.getElementById('confetti-container');
  const stage = document.getElementById('stage');
  const butterflyLayer = document.getElementById('butterfly-layer');

  const sampleImages = [
    'https://i.imgur.com/VVh3vF7.png',
    'https://i.imgur.com/m4FnWzR.png',
    'https://i.imgur.com/tV3xENB.png',
    'https://i.imgur.com/qLhQGyE.png'
  ];

  // State
  let motionReduced = false;
  reduceCheckbox?.addEventListener?.('change', e => {
    motionReduced = e.target.checked;
  });

  function enterApp() {
    intro.style.display = 'none';
    app.classList.remove('hidden');
    startTyping();
    spawnStageImages(7);
    startStarfield();
    startBokeh();
    spawnButterflies(3);
    autoEmitters(); // confetti + hearts intervals
  }

  introStart.addEventListener('click', enterApp);
  startBtn.addEventListener('click', enterApp);

  // Music toggle
  let musicOn = false;
  musicToggle.addEventListener('click', () => {
    if (!musicOn) {
      bgAudio.play().catch(()=>{/* user gesture may be required */});
      musicToggle.textContent = '🔇 Tắt nhạc';
      musicOn = true;
    } else {
      bgAudio.pause();
      musicToggle.textContent = '🔈 Nhạc';
      musicOn = false;
    }
  });

  // Share
  shareBtn.addEventListener('click', async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({title: 'Thiệp 20/10', text: 'Gửi tấm thiệp 20/10 cho bạn nhé', url});
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link đã copy vào clipboard!');
      }
    } catch (e) {
      prompt('Copy link thủ công:', url);
    }
  });

  /* ---------- Typewriter ---------- */
  const wish = `Chúc bạn có một ngày 20/10 ngập tràn yêu thương, hoa và nụ cười. Cám ơn vì mọi điều bạn đã làm — bạn thật tuyệt vời 🌸`;
  function startTyping() {
    if (motionReduced) { typewriterEl.textContent = wish; return; }
    typewriterEl.textContent = '';
    let idx = 0;
    const speed = 28;
    (function step(){
      if (idx <= wish.length) {
        typewriterEl.innerHTML = wish.slice(0, idx) + (idx % 2 ? '<span class="curs">|</span>' : '');
        idx++;
        setTimeout(step, speed);
      } else {
        typewriterEl.innerHTML = wish;
      }
    })();
  }

  /* ---------- Starfield (DOM) ---------- */
  function startStarfield() {
    if (motionReduced) return;
    const container = document.getElementById('starfield');
    const count = Math.min(260, Math.floor(window.innerWidth / 6));
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.4;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 100) + '%';
      star.style.opacity = Math.random();
      star.style.filter = `blur(${Math.random() * 1.6}px)`;
      container.appendChild(star);
      // twinkle
      (function animate(s, t1) {
        const dur = 2000 + Math.random()*3800;
        function tick(now) {
          const v = 0.2 + Math.abs(Math.sin(Date.now()/dur + (Math.random())));
          s.style.opacity = v;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      })(star, Date.now());
    }
  }

  /* ---------- Bokeh (DOM) ---------- */
  function startBokeh() {
    if (motionReduced) return;
    const container = document.getElementById('bokeh');
    for (let i = 0; i < 7; i++) {
      const el = document.createElement('div');
      const size = 200 + Math.random()*700;
      el.style.position = 'absolute';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.random()*(window.innerWidth - size) + 'px';
      el.style.top = Math.random()*(window.innerHeight - size) + 'px';
      el.style.background = `radial-gradient(circle, rgba(255,255,255,${0.08+Math.random()*0.12}), rgba(255,255,255,0) 50%)`;
      el.style.filter = 'blur(60px)';
      el.style.opacity = 0.7*Math.random();
      el.style.pointerEvents = 'none';
      container.appendChild(el);
      // animate subtle movement
      (function anim(elm) {
        const dur = 10000 + Math.random()*20000;
        function tick() {
          const t = (Date.now() % dur)/dur;
          elm.style.transform = `translate(${Math.sin(t*Math.PI*2)*40}px, ${Math.cos(t*Math.PI*2)*30}px)`;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      })(el);
    }
  }

  /* ---------- Stage images ziczac ---------- */
  const movers = [];
  function spawnStageImages(n = 6) {
    stage.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const img = document.createElement('img');
      img.src = sampleImages[i % sampleImages.length];
      img.className = 'stage-img';
      img.style.left = (20 + Math.random()*220) + 'px';
      img.style.top = (20 + Math.random()*160) + 'px';
      stage.appendChild(img);
      movers.push({
        el: img,
        x: parseFloat(img.style.left),
        y: parseFloat(img.style.top),
        vx: (Math.random()*1.8+0.4) * (Math.random()>0.5?1:-1),
        vy: (Math.random()*1.2+0.2) * (Math.random()>0.5?1:-1),
        swing: Math.random()*28+8,
        freq: Math.random()*0.02+0.008,
        rot: Math.random()*14-7
      });
    }
    animateMovers();
  }

  function animateMovers(){
    if (motionReduced) return;
    for (const m of movers) {
      m.x += m.vx;
      m.y += Math.sin(Date.now()*m.freq + m.x*0.01 + m.y*0.01) * (m.swing*0.02) + m.vy*0.15;
      const W = stage.clientWidth - 110;
      const H = stage.clientHeight - 110;
      if (m.x < 0 || m.x > W) m.vx = -m.vx;
      if (m.y < 0 || m.y > H) m.vy = -m.vy;
      const rot = Math.sin((Date.now()+m.x)*0.001)*m.rot;
      const scale = 0.95 + Math.sin(Date.now()*0.002 + m.x)*0.06;
      m.el.style.left = m.x + 'px';
      m.el.style.top = m.y + 'px';
      m.el.style.transform = `rotate(${rot}deg) scale(${scale})`;
    }
    requestAnimationFrame(animateMovers);
  }

  /* ---------- Hearts emitter (ziczac, sin path) ---------- */
  function emitHearts(count = 18) {
    if (motionReduced) return;
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'heart-dom';
      const size = 12 + Math.random()*36;
      h.style.width = size + 'px';
      h.style.height = size + 'px';
      const startX = Math.random()*window.innerWidth;
      h.style.left = startX + 'px';
      h.style.top = window.innerHeight + 'px';
      h.style.background = `linear-gradient(45deg,#ff6b8a,#ff3d7a)`;
      h.style.boxShadow = '0 8px 20px rgba(255,75,120,0.14)';
      heartsLayer.appendChild(h);
      const dur = 3000 + Math.random()*2200;
      const start = performance.now();
      const swing = 40 + Math.random()*120;
      (function frame(now){
        const t = (now - start)/dur;
        if (t >= 1) { h.remove(); return; }
        const y = window.innerHeight - t*(window.innerHeight + 200);
        const x = startX + Math.sin(t*Math.PI*2 + Math.random())*swing;
        h.style.left = x + 'px';
        h.style.top = y + 'px';
        h.style.opacity = String(1 - t);
        requestAnimationFrame(frame);
      })(performance.now());
    }
  }

  document.getElementById('send-hearts').addEventListener('click', ()=>emitHearts(26));

  /* ---------- Confetti emitter ---------- */
  function createConfettiPiece(){
    const el = document.createElement('div');
    el.className = 'confetti';
    const size = 6 + Math.random()*12;
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random()*window.innerWidth + 'px';
    el.style.top = '-40px';
    el.style.background = `hsl(${Math.random()*360},80%,60%)`;
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    confettiContainer.appendChild(el);
    setTimeout(()=>el.remove(), 4200);
  }

  function autoEmitters(){
    setInterval(()=> { if (!app.classList.contains('hidden')) createConfettiPiece(); }, 260);
    setInterval(()=> { if (!app.classList.contains('hidden')) emitHearts(6); }, 2500);
  }

  /* ---------- Fireworks (firework-like particles dom) ---------- */
  function launchFirework(x = innerWidth*0.5) {
    const count = 48;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'fire-p';
      const size = 2 + Math.random()*5;
      p.style.width = p.style.height = size + 'px';
      p.style.left = x + 'px';
      p.style.top = innerHeight + 'px';
      p.style.background = `hsl(${Math.random()*360}, 100%, 60%)`;
      document.body.appendChild(p);
      const angle = Math.random()*Math.PI*2;
      const speed = 1.5 + Math.random()*6;
      const vx = Math.cos(angle)*speed;
      const vy = -Math.abs(Math.sin(angle)*speed) - 2;
      const life = 800 + Math.random()*900;
      const start = performance.now();
      (function frame(now){
        const t = (now - start)/life;
        if (t >= 1) { p.remove(); return; }
        const nx = x + vx * t * 200;
        const ny = innerHeight + vy * t * 200 + 0.5 * 200 * t*t; // gravity approx
        p.style.left = nx + 'px';
        p.style.top = ny + 'px';
        p.style.opacity = String(1 - t);
        requestAnimationFrame(frame);
      })(performance.now());
    }
  }
  document.getElementById('launch-fire').addEventListener('click', ()=>{ launchFirework(innerWidth*0.35); launchFirework(innerWidth*0.65); });

  /* ---------- Butterflies (DOM) ---------- */
  function spawnButterflies(n=2){
    for (let i=0;i<n;i++){
      const b = document.createElement('div');
      b.className = 'butterfly';
      b.style.backgroundImage = 'url(https://i.imgur.com/8Km9tLL.png)';
      b.style.left = Math.random()*window.innerWidth + 'px';
      b.style.top = (window.innerHeight*0.6 + Math.random()*200) + 'px';
      butterflyLayer.appendChild(b);
      animateButterfly(b);
    }
  }
  function animateButterfly(el){
    const dur = 8000 + Math.random()*8000;
    const start = performance.now();
    const sx = parseFloat(el.style.left);
    const sy = parseFloat(el.style.top);
    (function f(now){
      const t = ((now - start) % dur)/dur;
      const nx = sx + Math.sin(t*Math.PI*2)* (120 + Math.random()*160);
      const ny = sy + Math.cos(t*Math.PI*2)* (40 + Math.random()*40) - Math.abs(Math.sin(t*Math.PI*2))*40;
      el.style.transform = `translate(${nx - sx}px, ${ny - sy}px) rotate(${Math.sin(t*Math.PI*2)*20}deg)`;
      requestAnimationFrame(f);
    })(performance.now());
  }

  /* ---------- Ripple on click ---------- */
  document.addEventListener('click', (e) => {
    // if click on control buttons, skip
    if (e.target.closest('#controls')) return;
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(()=> r.remove(), 700);
  });

  /* ---------- Download small static snapshot (simple) ---------- */
  document.getElementById('download-card').addEventListener('click', (e) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Thiệp 20/10</title></head><body><h1>Chúc mừng 20/10</h1><p>Gửi yêu thương</p></body></html>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    e.target.href = url;
    e.target.download = 'chuc-mung-20-10.html';
    setTimeout(()=> URL.revokeObjectURL(url), 5000);
  });

  /* Accessibility: pause audio on page hidden */
  document.addEventListener('visibilitychange', ()=>{
    if (document.hidden) bgAudio.pause();
    else if (musicOn) bgAudio.play();
  });

  // Expose for debug
  window.cardHelpers = { emitHearts, spawnStageImages, launchFirework, spawnButterflies };
})();
