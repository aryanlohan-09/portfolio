'use strict';

/* ── LOADER ─────────────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.querySelector('#hero .reveal')?.classList.add('visible');
  }, 1300);
});

/* ── SCROLL PROGRESS ─────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
const backToTop   = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
  backToTop.classList.toggle('show', window.scrollY > 400);
  updateNav();
}, { passive: true });

/* ── NAVBAR ──────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateNav() {
  const y = window.scrollY + 110;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
}

/* ── SUBTLE PARTICLE CANVAS ──────────────────────────── */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
let particles = [], raf;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Dot {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 1.2 + .3;
    this.vx = (Math.random() - .5) * .3;
    this.vy = (Math.random() - .5) * .3;
    this.a  = Math.random() * .35 + .08;
    this.c  = Math.random() > .5 ? '147,51,234' : '99,102,241';
  }
  step() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.c},${this.a})`;
    ctx.fill();
  }
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(147,51,234,${(1 - d/100) * .07})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.step(); p.draw(); });
  connect();
  raf = requestAnimationFrame(animate);
}

function initParticles() {
  cancelAnimationFrame(raf);
  resize();
  const n = Math.min(Math.floor(canvas.width * canvas.height / 12000), 90);
  particles = Array.from({ length: n }, () => new Dot());
  animate();
}

initParticles();
window.addEventListener('resize', initParticles);

/* ── TYPED EFFECT ────────────────────────────────────── */
const typedEl = document.getElementById('typed');
const words   = ['MCA Student', 'Aspiring Developer', 'Problem Solver', 'Open to Internships'];
let wi = 0, ci = 0, del = false, spd = 100;

function type() {
  const w = words[wi];
  typedEl.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
  if (!del && ci === w.length)    { del = true;  spd = 1800; }
  else if (del && ci === 0)       { del = false; wi = (wi + 1) % words.length; spd = 300; }
  else spd = del ? 45 : 90;
  setTimeout(type, spd);
}
setTimeout(type, 1500);

/* ── SCROLL REVEAL ───────────────────────────────────── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  obs.observe(el);
});

/* ── SKILL BARS ──────────────────────────────────────── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.sk-fill');
      if (fill) setTimeout(() => fill.classList.add('animated'), 100);
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-row').forEach(r => skillObs.observe(r));

/* ── CONTACT FORM ────────────────────────────────────── */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').classList.add('show');
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => document.getElementById('form-success').classList.remove('show'), 5000);
  }, 900);
});

/* ── BACK TO TOP ─────────────────────────────────────── */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SMOOTH SCROLL ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - navbar.offsetHeight - 12, behavior: 'smooth' });
  });
});

/* ── YEAR ────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
