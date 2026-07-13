const root = document.documentElement;
const loader = document.querySelector('.loader');
const progressBar = document.querySelector('.scroll-progress');
const cursor = document.querySelector('.cursor');
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const typedText = document.getElementById('typed-text');
const form = document.getElementById('contact-form');
const formMessage = document.querySelector('.form-message');

const phrases = [
  'Cloud Engineer',
  'AWS Enthusiast',
  'DevOps Engineer',
  'Linux Administrator',
  'Terraform Practitioner',
  'Docker & Kubernetes Learner',
  'Cloud Automation'
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
}

function typeLoop() {
  const current = phrases[phraseIndex];
  typedText.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

  if (!deleting && charIndex === current.length + 1) {
    deleting = true;
    setTimeout(typeLoop, 900);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeLoop, deleting ? 60 : 110);
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target);
      const duration = 1200;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = `${value}+`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => observer.observe(counter));
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => observer.observe(item));
}

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
}

function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    const count = Math.min(70, Math.floor(window.innerWidth / 16));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.6,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      color: Math.random() > 0.5 ? '#00c2ff' : '#4f46e5'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

function handleCursorMove(e) {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
}

function addSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top, behavior: 'smooth' });
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

themeToggle.addEventListener('click', () => {
  const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
});

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
});

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('mousemove', handleCursorMove);
window.addEventListener('mousedown', () => cursor.classList.add('active'));
window.addEventListener('mouseup', () => cursor.classList.remove('active'));

form.addEventListener('submit', event => {
  event.preventDefault();
  formMessage.textContent = 'Thanks for reaching out — I will get back soon.';
  form.reset();
});

initializeTheme();
addSmoothScroll();
revealOnScroll();
animateCounters();
initParticles();
typeLoop();
updateProgress();

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 800);
});
