/* Portfolio: persistent theme and one-time, lightweight section reveals. */
(() => {
  'use strict';

  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const language = root.lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateThemeButton() {
    if (!button) return;
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', language === 'fr'
      ? (dark ? 'Activer le mode jour' : 'Activer le mode nuit')
      : (dark ? 'Switch to light mode' : 'Switch to dark mode'));
    button.title = language === 'fr' ? 'Changer de thème' : 'Toggle color theme';
  }

  if (button) {
    updateThemeButton();
    let switching = false;
    button.addEventListener('click', () => {
      if (switching) return;
      switching = true;
      window.setTimeout(() => {
        const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = theme;
        try { localStorage.setItem('portfolio-theme', theme); } catch (error) { /* Storage is optional. */ }
        updateThemeButton();
        switching = false;
      }, 360);
    });
  }

  // Keep one skill rating active at a time for pointer and keyboard interaction.
  const skillCards = Array.from(document.querySelectorAll('.skill-card'));
  skillCards.forEach((card) => {
    const activate = () => {
      skillCards.forEach((other) => {
        if (other !== card) other.classList.remove('is-rating-active');
      });
      card.classList.add('is-rating-active');
    };
    const deactivate = () => card.classList.remove('is-rating-active');
    card.addEventListener('pointerenter', activate);
    card.addEventListener('pointerleave', () => {
      if (!card.matches(':focus-within')) deactivate();
    });
    card.addEventListener('focusin', activate);
    card.addEventListener('focusout', (event) => {
      if (!card.contains(event.relatedTarget) && !card.matches(':hover')) deactivate();
    });
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    root.classList.add('js');
    const sections = document.querySelectorAll('.intro, .section, .site-footer');
    sections.forEach((section) => {
      section.classList.add('reveal');
      if (section.querySelector('.skill-groups')) section.querySelector('.skill-groups').classList.add('reveal-stagger');
    });
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    sections.forEach((section) => observer.observe(section));
  } else if (!reducedMotion) {
    root.classList.add('js');
  }
})();
