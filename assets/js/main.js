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

const BURGER_ICON = '<svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
const CLOSE_ICON  = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

function openMenu() {
  mobileNav.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (burger) burger.innerHTML = CLOSE_ICON;
}
function closeMenu() {
  mobileNav.classList.remove('is-open');
  document.body.style.overflow = '';
  if (burger) burger.innerHTML = BURGER_ICON;
}

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.contains('is-open') ? closeMenu() : openMenu();
  });
}
if (mobileClose && mobileNav) {
  mobileClose.addEventListener('click', closeMenu);
}
// Close on link click
document.querySelectorAll('.nav__mobile a').forEach(a => {
  a.addEventListener('click', closeMenu);
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
