// ====== PERSONALIZE AQUI ======
const CONFIG = {
  nome: "Seu Nome",
  inicioNamoro: "2026-06-20T00:00:00", // data em que vocês começaram
  proximoAniversario: "2027-03-20T00:00:00", // próxima data de aniversário
};
// ==============================

document.querySelectorAll("[data-name]").forEach(e => e.textContent = CONFIG.nome);
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, "0");

// Fotos: aceita foto1.jpg, .jpeg, .png ou .webp (mistura é permitida)
const EXTS = ["jpg", "png", "jpeg", "webp", "JPG", "PNG", "JPEG", "WEBP"];
document.querySelectorAll("img[data-n]").forEach(img => {
  let i = 0;
  const next = () => {
    if (i >= EXTS.length) { img.parentElement.remove(); return; }
    img.src = `assets/foto${img.dataset.n}.${EXTS[i++]}`;
  };
  img.onerror = next; next();
});

// Música (assets/musica.mp3)
const audio = new Audio("assets/musica.mp3");
audio.loop = true;
const musicBtn = $("#music");
let userPaused = false;
musicBtn.onclick = (e) => {
  e.stopPropagation();
  if (audio.paused) { audio.play().catch(()=>{}); userPaused = false; musicBtn.classList.add("on"); }
  else { audio.pause(); userPaused = true; musicBtn.classList.remove("on"); }
};

// Abrir o site
let opened = false;
function openSite() {
  if (opened) return; opened = true;
  $("#intro").classList.add("gone");
  $("#site").hidden = false;
  audio.play().then(() => musicBtn.classList.add("on")).catch(()=>{});
  burst(18);
  observe();
}
$("#intro").addEventListener("pointerdown", openSite);
$("#open").addEventListener("click", openSite);
// Garante a música no primeiro toque em qualquer lugar
addEventListener("pointerdown", () => {
  if (audio.paused && !userPaused) audio.play().then(() => musicBtn.classList.add("on")).catch(()=>{});
}, { once: true });

// Contadores
function box(v, l) { return `<div><b>${v}</b><span>${l}</span></div>`; }
function tick() {
  const now = new Date();
  let d = (now - new Date(CONFIG.inicioNamoro)) / 1000;
  $("#together").innerHTML = box(Math.floor(d/86400),"dias")+box(pad(Math.floor(d%86400/3600)),"horas")+box(pad(Math.floor(d%3600/60)),"min")+box(pad(Math.floor(d%60)),"seg");
  d = Math.max(0, (new Date(CONFIG.proximoAniversario) - now) / 1000);
  $("#countdown").innerHTML = box(Math.floor(d/86400),"dias")+box(pad(Math.floor(d%86400/3600)),"horas")+box(pad(Math.floor(d%3600/60)),"min")+box(pad(Math.floor(d%60)),"seg");
}
tick(); setInterval(tick, 1000);

// Corações flutuando
const EMOJIS = ["❤️","💖","💕","🌹","✨","💗"];
function heart(x) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
  h.style.left = (x ?? Math.random()*100) + "vw";
  h.style.fontSize = 14 + Math.random()*26 + "px";
  h.style.animationDuration = 6 + Math.random()*6 + "s";
  $("#hearts").appendChild(h);
  setTimeout(() => h.remove(), 12500);
}
setInterval(heart, 700);
function burst(n) { for (let i=0;i<n;i++) setTimeout(heart, i*60); }

// Efeitos ao rolar
function observe() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

// Botão de surpresa
$("#gift").onclick = () => {
  $("#giftMsg").classList.add("open");
  $("#gift").textContent = "🎉 Surpresa!";
  burst(40);
};

// Fundo de estrelas
const cv = $("#stars"), ctx = cv.getContext("2d");
let stars = [];
function resize() {
  cv.width = innerWidth; cv.height = innerHeight;
  stars = Array.from({length: 90}, () => ({x:Math.random()*cv.width, y:Math.random()*cv.height, r:Math.random()*1.6+.3, p:Math.random()*6}));
}
addEventListener("resize", resize); resize();
(function draw(t=0) {
  ctx.clearRect(0,0,cv.width,cv.height);
  for (const s of stars) {
    ctx.globalAlpha = .4 + .6*Math.abs(Math.sin(t/1000 + s.p));
    ctx.fillStyle = "#ffe9c7";
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
  }
  requestAnimationFrame(draw);
})();

// Pausa/retoma a música ao sair/voltar para o site
document.addEventListener("visibilitychange", () => {
  if (document.hidden) audio.pause();
  else if (opened && !userPaused) audio.play().catch(()=>{});
});

// Rotação da tela: recalcula o fundo de estrelas
addEventListener("orientationchange", () => setTimeout(resize, 250));

// Toque/arraste na tela solta corações
let lastT = 0;
function touchHeart(e) {
  if (!opened || e.target.closest("#lb")) return;
  const now = Date.now(); if (now - lastT < 120) return; lastT = now;
  heart(e.clientX / innerWidth * 100);
  const h = $("#hearts").lastChild; h.style.bottom = "auto"; h.style.top = e.clientY + "px";
  h.style.animation = "pop 1.2s ease-out forwards";
}
addEventListener("pointermove", e => { if (e.pressure > 0 || e.pointerType === "touch") touchHeart(e); });
addEventListener("pointerdown", touchHeart);
const st = document.createElement("style");
st.textContent = "@keyframes pop{to{transform:translateY(-90px) scale(1.6);opacity:0}}";
document.head.appendChild(st);

// Galeria: toque para ampliar, deslize para trocar de foto
const lb = $("#lb"), lbImg = lb.querySelector("img");
let imgs = [], idx = 0;
function show(i) {
  idx = (i + imgs.length) % imgs.length;
  lbImg.classList.add("out");
  setTimeout(() => { lbImg.src = imgs[idx].src; lbImg.classList.remove("out"); }, 150);
}
document.querySelectorAll("figure").forEach(f => f.addEventListener("click", () => {
  imgs = [...document.querySelectorAll("figure img")];
  const im = f.querySelector("img"); if (!im) return;
  idx = imgs.indexOf(im); lbImg.src = im.src; lb.hidden = false;
}));
let x0 = null;
lb.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => {
  const d = e.changedTouches[0].clientX - x0;
  if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); else lb.hidden = true;
});
lb.addEventListener("click", e => { if (e.pointerType !== "touch" && e.detail) lb.hidden = true; });
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") lb.hidden = true;
  if (e.key === "ArrowRight") show(idx + 1);
  if (e.key === "ArrowLeft") show(idx - 1);
});
