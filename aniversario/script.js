// ====== PERSONALIZE AQUI ======
const CONFIG = {
  codigo: "1910", // código da mensagem secreta
  amo: ["Seus olhos","Seu cabelo","Seu sorriso","Seu jeito de ser","As nossas brincadeiras","Seu ciúmes (que eu acho fofo)","Seu carinho","Seu abraço","Como você me faz rir","Simplesmente você"],
  quiz: [
    {q:"Em que mês começamos?",o:["Maio","Junho","Julho"],a:1},
    {q:"Qual é a minha cor favorita?",o:["Azul","Preto","Vermelho"],a:0},
    {q:"Quem se declarou primeiro?",o:["Eu","Você","Foi junto"],a:2}
  ],
  final: ["Eloyse…","Se eu pudesse escolher de novo,","eu escolheria você, todos os dias.","Feliz aniversário, meu amor. ❤️"],
  nome: "Eloyse",
  inicioNamoro: "2026-06-20T00:00:00", // data em que vocês começaram
  proximoAniversario: "2026-10-19T00:00:00", // próxima data de aniversário
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
  img.onload = () => img.classList.add("ok");
  img.decoding = "async";
  img.onerror = next; next();
});

// Música (assets/musica.mp3)
const audio = new Audio("assets/musica.mp3");
audio.loop = true;
audio.preload = "none"; // não disputa internet com as fotos
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
function heart(x, set = EMOJIS) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = set[Math.floor(Math.random()*set.length)];
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
  burst(40); balloons(30);
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
  heart(e.clientX / innerWidth * 100, ["🌸","🌹","🌷","🌼","💮"]);
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

// ===== Novidades =====
const BAL = ["🎈","🎉","🎊","🎈","🎁"];
function balloons(n) { for (let i=0;i<n;i++) setTimeout(() => heart(undefined, BAL), i*90); }
const wait = ms => new Promise(r => setTimeout(r, ms));
async function type(el, text, sp = 35) {
  el.classList.add("cur");
  for (const ch of text) { el.textContent += ch; await wait(sp); }
  el.classList.remove("cur");
}
$("#env").onclick = async function () {
  if (this.classList.contains("open")) return;
  this.classList.add("open"); burst(15);
  await wait(700);
  const L = $("#letter"), ps = [...L.querySelectorAll("p")];
  const groups = ps.map(p => {
    if (p.innerHTML.includes("<br>")) { p.style.opacity = 0; return [p]; }
    const t = p.textContent;
    p.innerHTML = [...t].map(c => `<span style="opacity:0">${c}</span>`).join("");
    return [...p.children];
  });
  L.hidden = false;
  for (const g of groups) {
    if (g.length === 1 && g[0].tagName === "P") { g[0].style.transition = "opacity 1s"; g[0].style.opacity = 1; await wait(900); continue; }
    for (const s of g) { s.style.opacity = 1; await wait(22); }
    await wait(250);
  }
};
$("#love").innerHTML = CONFIG.amo.map((t, i) => `<li class="a${i%5}">${i+1}. ${t}</li>`).join("");
const lio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { setTimeout(() => e.target.classList.add("show"), 150); lio.unobserve(e.target); }
}), { threshold: .4 });
document.querySelectorAll("#love li").forEach(l => lio.observe(l));
let qi = 0, pts = 0;
function quiz() {
  const Q = CONFIG.quiz, box = $("#quiz");
  if (qi >= Q.length) { box.innerHTML = `<p class="lead">Você acertou ${pts} de ${Q.length}! 💖</p>`; balloons(20); return; }
  box.innerHTML = `<p class="lead">${Q[qi].q}</p>` + Q[qi].o.map((o, i) => `<button data-i="${i}">${o}</button>`).join("");
  box.querySelectorAll("button").forEach(b => b.onclick = () => {
    const ok = +b.dataset.i === Q[qi].a;
    b.classList.add(ok ? "ok" : "no"); if (ok) { pts++; burst(8); }
    box.querySelectorAll("button").forEach(x => x.disabled = true);
    setTimeout(() => { qi++; quiz(); }, 900);
  });
}
quiz();
$("#unlock").onclick = () => {
  const v = $("#code").value.replace(/\D/g, "");
  if (v === CONFIG.codigo) { $("#secret").classList.add("open"); burst(30); setTimeout(() => $("#secret").scrollIntoView({behavior:"smooth", block:"center"}), 300); }
  else { $("#code").value = ""; $("#code").placeholder = "código errado 💭"; }
};
let cineRun = 0;
function closeCine() { cineRun++; $("#cine").hidden = true; document.body.classList.remove("cine-on"); }
$("#cineX").onclick = closeCine;
$("#cineBtn").onclick = async () => {
  const id = ++cineRun, c = $("#cine"), p = $("#cineTxt"), alive = () => id === cineRun;
  c.hidden = false; document.body.classList.add("cine-on"); p.style.fontSize = "";
  await wait(800);
  for (const line of CONFIG.final) {
    if (!alive()) return;
    p.style.transition = "none"; p.textContent = ""; p.style.opacity = 1;
    for (const ch of line) { if (!alive()) return; p.textContent += ch; await wait(60); }
    await wait(1600); if (!alive()) return;
    p.style.transition = "opacity 1s"; p.style.opacity = 0; await wait(1100);
  }
  if (!alive()) return;
  p.style.transition = "opacity 1.5s"; p.innerHTML = "❤️<br>Eu te amo, " + CONFIG.nome; p.style.fontSize = "2.2rem"; p.style.opacity = 1;
  balloons(40); burst(40);
};
