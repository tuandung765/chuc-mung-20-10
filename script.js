const intro = document.getElementById("intro");
const main = document.getElementById("main");
const startBtn = document.getElementById("startBtn");
const music = document.getElementById("bg-music");
const wishText = document.getElementById("wishText");
const toggleMusic = document.getElementById("toggleMusic");

startBtn.addEventListener("click", () => {
  intro.style.display = "none";
  main.style.display = "block";
  music.play();
  startFireworks();
  startHearts();
  typeWriter(longWish);
});

toggleMusic.addEventListener("click", () => {
  if (music.paused) music.play();
  else music.pause();
});

// Long message
const longWish = `
Chúc mừng ngày Phụ Nữ Việt Nam 20/10 🌹  
Ngày để tôn vinh vẻ đẹp, lòng nhân hậu, trí tuệ và sự kiên cường của những người phụ nữ.  
Dù bạn là mẹ hiền, cô giáo, người bạn, người yêu hay đồng nghiệp –  
bạn là ánh sáng dịu dàng khiến thế giới trở nên tươi đẹp hơn. 💖  

Hãy luôn tự tin, yêu đời, và nhớ rằng mỗi nụ cười của bạn  
chính là nguồn cảm hứng cho biết bao người xung quanh.  
Mong bạn có một ngày tràn đầy hoa, nắng và niềm vui —  
vì bạn xứng đáng với tất cả những điều ngọt ngào nhất trên đời này! 🌸  

Chúc bạn luôn hạnh phúc, thành công và được yêu thương mỗi ngày.  
Từ một người thật lòng ngưỡng mộ bạn ❤️
`;

function typeWriter(text, i = 0) {
  if (i < text.length) {
    wishText.innerHTML += text.charAt(i);
    setTimeout(() => typeWriter(text, i + 1), 40);
  }
}

// Hearts floating
function startHearts() {
  const heartsContainer = document.getElementById("hearts");
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.textContent = "💖";
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 300);
}

// Fireworks
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let fireworks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function startFireworks() {
  setInterval(() => {
    fireworks.push({
      x: random(0, canvas.width),
      y: canvas.height,
      speed: random(4, 8),
      radius: random(2, 4),
      colors: `hsl(${random(0, 360)},100%,60%)`,
      particles: []
    });
  }, 600);

  animateFireworks();
}

function animateFireworks() {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((f, i) => {
    f.y -= f.speed;
    if (f.y < random(canvas.height / 3, canvas.height / 2)) {
      explode(f);
      fireworks.splice(i, 1);
    }
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, 2 * Math.PI);
    ctx.fillStyle = f.colors;
    ctx.fill();
  });

  for (let j = particles.length - 1; j >= 0; j--) {
    let p = particles[j];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.alpha -= 0.01;
    if (p.alpha <= 0) particles.splice(j, 1);
  }

  requestAnimationFrame(animateFireworks);
}

let particles = [];

function explode(f) {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: f.x,
      y: f.y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      size: random(2, 4),
      color: f.colors,
      alpha: 1
    });
  }
}
