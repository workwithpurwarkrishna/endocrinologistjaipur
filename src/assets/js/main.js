/* ── DARK MODE ── */
(function () {
  const html = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const moonIcon = btn && btn.querySelector('.icon-moon');
  const sunIcon = btn && btn.querySelector('.icon-sun');

  const stored = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let theme = stored || preferred;

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    if (btn) btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
    if (moonIcon && sunIcon) {
      moonIcon.style.display = t === 'dark' ? 'none' : '';
      sunIcon.style.display = t === 'dark' ? '' : 'none';
    }
    localStorage.setItem('theme', t);
  }

  applyTheme(theme);
  btn && btn.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(theme); });
})();

/* ── HAMBURGER MENU ── */
(function () {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }));
})();

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
    });
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-answer').setAttribute('aria-hidden', 'false');
    }
  });
});

/* ── SCROLL REVEAL ── */
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── STAT COUNTER ANIMATION ── */
(function () {
  const counters = document.querySelectorAll('[data-count-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.countTarget, 10);
      const suffix = el.dataset.countSuffix || '';
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();
