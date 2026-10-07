// ====== PERSONALIZE AQUI ======
const CONFIG = {
  mensagens: [
    {t:"Abra quando estiver triste", video:"assets/triste.mp4", m:"Respira fundo, meu amor. Os dias difíceis passam, e eu estou aqui do seu lado. Você é mais forte do que imagina e eu tenho muito orgulho de você. Pode chorar, pode desabafar, eu fico com você. 💖"},
    {t:"Abra quando sentir saudade", m:"Oi, meu amor… se você está vendo isso, é porque bateu saudade.\n\nAqui também bate. Às vezes eu paro e fico lembrando de você… do nosso primeiro encontro, do nosso primeiro beijo na praça, das nossas brincadeiras.\n\nEu quero te falar que eu te amo muito, muito mesmo.\n\nAgora fecha os olhos… e imagina eu te abraçando bem forte. Tá sentindo? Eu tô aí com você. 💖"},
    {t:"Abra quando quiser sorrir", m:"Oii, meu amor! Se você veio aqui é porque precisa de um sorriso, então vamos lá…\n\nPrimeiro motivo: você tem eu ao seu lado, claro, alguém muito engraçado.\n\nSegundo motivo: você é a pessoa mais dramática que eu conheço kkkk\n\nTerceiro motivo: lembra do nosso primeiro beijo lá na praça? Eu lembro até hoje e sorrio sozinho kkkk\n\nAgora dá um sorrisinho aí pra mim, acho que eu mereço kkk"},
    {t:"Abra quando duvidar do quanto eu te amo", video:"assets/duvidar.mp4", m:"Se um dia você duvidar, lembra: eu escolhi você, e continuo escolhendo todos os dias. Eu te amo mais do que consigo dizer. ❤️"},
    {t:"Abra no seu próximo aniversário", soon:true, video:"assets/aniversario.mp4", lock:"2027-10-19T00:00:00", m:"Mais um ano da sua vida, e eu continuo aqui, ainda mais apaixonado. Obrigado por cada momento deste ano. Feliz aniversário, meu amor! 🎂"}
  ],
  codigo: "1910", // código da mensagem secreta
  amo: ["Seus olhos","Seu cabelo","Seu sorriso","Seu jeito de ser","As nossas brincadeiras","Seu ciúmes (que eu acho fofo)","Seu carinho","Seu abraço","Como você me faz rir","Simplesmente você"],
  quiz: [
    {q:"Quem é o mais romântico?",o:["Miqueias","Eloyse","Os dois"],a:0},
    {q:"Quem é o mais dramático?",o:["Miqueias","Eloyse","Os dois"],a:1},
    {q:"Quem é o mais engraçado?",o:["Miqueias","Eloyse","Os dois"],a:0}
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

// Caixa de mensagens
$("#mails").innerHTML = CONFIG.mensagens.map((x, i) => `<button class="mail${x.soon || x.lock ? " lock" : ""}" data-i="${i}">${x.t}</button>`).join("");
document.querySelectorAll(".mail").forEach(b => b.onclick = () => {
  const x = CONFIG.mensagens[b.dataset.i];
  const locked = x.soon || (x.lock && new Date() < new Date(x.lock));
  $("#mt").textContent = x.t;
  $("#mbox").classList.toggle("voice", !!(x.audio && !locked));
  document.body.classList.toggle("cine-on", !!(x.audio && !locked));
  if (x.audio && !locked) { $("#mv").innerHTML = voiceHTML(x.audio); setupVoice(); } else
  $("#mv").innerHTML = x.video && !locked ? `<video src="${x.video}" controls playsinline preload="metadata" onerror="this.remove()"></video>` : "";
  $("#mm").textContent = x.soon ? "🔒 Agora não, amor, espere! Essa ainda está sendo preparada com muito carinho. Logo ela abre. 💕" : locked ? "🔒 Essa só abre no seu próximo aniversário. Ainda não, amor! Volte nessa data e eu vou estar aqui. 💕" : x.m;
  $("#mbox").hidden = false; if (!locked) burst(12);
});
function closeMsg() {
  if (window._vs) window._vs();
  $("#mbox").hidden = true; $("#mv").innerHTML = ""; $("#mbox").classList.remove("voice"); document.body.classList.remove("cine-on");
  if (!userPaused && audio.paused) audio.play().catch(()=>{});
}
$("#mx").onclick = closeMsg;
$("#mbox").addEventListener("click", e => { if (e.target.id === "mbox") closeMsg(); });
// Pausa a música enquanto o vídeo toca
$("#mbox").addEventListener("play", e => { if (e.target.tagName === "VIDEO" || e.target.tagName === "AUDIO") audio.pause(); }, true);

// Player de voz bonito (áudio gravado por você)
const AEXT = ["mp3","m4a","ogg","opus","wav","aac","webm"];
function voiceHTML(base) {
  return `<div class="voice"><div class="orb" id="orb"><i></i><i></i><button id="pbtn" aria-label="Tocar">▶</button></div>
  <div class="bars" id="bars">${"<b></b>".repeat(26)}</div>
  <div class="prog" id="prog"><div id="pfill"></div></div><small id="ptime">toque para ouvir 💌</small>
  <audio id="vaud" preload="metadata">${AEXT.map(e => `<source src="${base}.${e}">`).join("")}</audio></div>`;
}
function setupVoice() {
  const a = $("#vaud"), btn = $("#pbtn"), orb = $("#orb"), bars = [...document.querySelectorAll("#bars b")];
  const fmt = s => Math.floor(s/60) + ":" + pad(Math.floor(s%60));
  a.querySelector("source:last-child").addEventListener("error", () => { const v = document.querySelector(".voice"); if (v) v.remove(); });
  let ctx, an, data, raf, hb;
  const loop = () => {
    if (an) { an.getByteFrequencyData(data); bars.forEach((b, i) => b.style.transform = `scaleY(${.12 + data[i*2] / 255 * 1.2})`); }
    else bars.forEach(b => b.style.transform = `scaleY(${.2 + Math.random()})`);
    raf = requestAnimationFrame(loop);
  };
  const stop = () => { cancelAnimationFrame(raf); clearInterval(hb); orb.classList.remove("on"); btn.textContent = "▶"; bars.forEach(b => b.style.transform = ""); };
  window._vs = () => { stop(); a.pause(); };
  btn.onclick = () => {
    if (!a.paused) { a.pause(); return; }
    audio.pause();
    if (location.protocol.startsWith("http") && !an) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        const s = ctx.createMediaElementSource(a); an = ctx.createAnalyser(); an.fftSize = 128;
        data = new Uint8Array(an.frequencyBinCount); s.connect(an); an.connect(ctx.destination);
      } catch (e) { an = null; }
    }
    if (ctx) ctx.resume();
    a.play();
  };
  a.addEventListener("play", () => { orb.classList.add("on"); btn.textContent = "❚❚"; loop(); hb = setInterval(heart, 450); });
  a.addEventListener("pause", stop);
  a.addEventListener("ended", () => { stop(); btn.textContent = "↻"; burst(20); });
  a.addEventListener("timeupdate", () => { if (!$("#pfill")) return; $("#pfill").style.width = (a.currentTime / a.duration * 100 || 0) + "%"; $("#ptime").textContent = fmt(a.currentTime) + " / " + fmt(a.duration || 0); });
  $("#prog").onclick = e => { const r = e.currentTarget.getBoundingClientRect(); if (a.duration) a.currentTime = (e.clientX - r.left) / r.width * a.duration; };
}
