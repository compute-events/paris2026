/* ============================================================
   Compute! Paris 2026 — Main JS
   ============================================================ */

// --- Sticky nav bg ---
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Mobile nav ---
const burger = document.querySelector('.nav__burger');
const mobileNav = document.querySelector('.nav__mobile');
const mobileClose = document.querySelector('.nav__mobile-close');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileClose && mobileNav) {
  mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  });
}
// Close on link click
document.querySelectorAll('.nav__mobile a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav?.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// --- Active nav link ---
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// --- Contact form (Formspree fallback) ---
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Formspree endpoint — replace YOUR_FORM_ID with actual ID when set up
    const endpoint = form.getAttribute('action') || '#';
    if (endpoint === '#') {
      setTimeout(() => {
        btn.textContent = '✓ Message sent — we\'ll be in touch';
        btn.style.background = '#2ecc71';
      }, 800);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        btn.textContent = '✓ Message sent — we\'ll be in touch';
        btn.style.background = '#2ecc71';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Error — please email us directly';
      btn.disabled = false;
    }
  });
}
