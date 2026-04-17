/* ============================================================
   ESCAPE — Gaming Club Landing  |  main.js
   ============================================================ */

/* ---------- Pricing tabs ---------------------------------- */
document.querySelectorAll('.price-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.price-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.tab;
    document.getElementById('tab-packages').style.display = target === 'packages' ? '' : 'none';
    document.getElementById('tab-time').style.display = target === 'time' ? '' : 'none';
  });
});

/* ---------- NAV scroll effect ----------------------------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- Burger (mobile) -------------------------------- */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');
burger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
});

/* ---------- Smooth active nav links ----------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      navLinks?.classList.remove('open');
    }
  });
});

/* ---------- Intersection Observer — reveal on scroll ------- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObs.observe(el));

/* ---------- Counter animation ------------------------------ */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target).toLocaleString('ru');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('ru');
  };
  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-item__num');
      const target = parseInt(numEl?.dataset.target || 0, 10);
      animateCounter(numEl, target);
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-item').forEach(el => statObs.observe(el));

/* ---------- Typewriter in monitor -------------------------- */
const typeEl = document.getElementById('typeText');
const lines = [
  'ESCAPE v1.0.0',
  '> Инициализация...',
  '> 120 ПК онлайн',
  '> Пинг: 2ms',
  '> READY',
];
let lineIdx = 0, charIdx = 0, isDeleting = false;

function typeWriter() {
  if (!typeEl) return;
  const current = lines[lineIdx];
  if (isDeleting) {
    typeEl.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      lineIdx = (lineIdx + 1) % lines.length;
      setTimeout(typeWriter, 500);
      return;
    }
    setTimeout(typeWriter, 40);
  } else {
    typeEl.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) {
      setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
      return;
    }
    setTimeout(typeWriter, 70);
  }
}
setTimeout(typeWriter, 1000);

/* ---------- Particle canvas ------------------------------- */
const canvas = document.getElementById('particles');
const ctx = canvas?.getContext('2d');

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const PARTICLE_COUNT = 60;
const particles = [];

function randomColor() {
  const purples = ['rgba(124,58,237,', 'rgba(168,85,247,', 'rgba(192,132,252,'];
  return purples[Math.floor(Math.random() * purples.length)];
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + .5,
    dx: (Math.random() - .5) * .4,
    dy: (Math.random() - .5) * .4,
    color: randomColor(),
    alpha: Math.random() * .5 + .1,
  });
}

function drawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${.08 * (1 - dist / 120)})`;
        ctx.lineWidth = .6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---------- Mouse parallax on hero ----------------------- */
const heroContent = document.querySelector('.hero__content');
document.addEventListener('mousemove', e => {
  if (!heroContent) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  heroContent.style.transform = `translate(${dx * 8}px, ${dy * 5}px)`;
}, { passive: true });

/* ---------- Contact form submit (demo) ------------------- */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = '✓ Заявка отправлена!';
  btn.style.background = 'linear-gradient(135deg,#16a34a,#22c55e)';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
    form.reset();
  }, 3500);
});

/* ---------- Zone fill bars trigger on reveal ------------- */
const zoneObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.3 });
document.querySelectorAll('.zone-item').forEach(el => zoneObs.observe(el));

/* ---------- Nav mobile open style ------------------------ */
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav__links.open {
      display: flex !important;
      flex-direction: column;
      position: fixed; top: 64px; left: 0; right: 0;
      background: rgba(5,5,7,.95);
      backdrop-filter: blur(20px);
      padding: 24px;
      gap: 20px;
      border-bottom: 1px solid rgba(124,58,237,.15);
      z-index: 99;
    }
  }
`;
document.head.appendChild(style);
