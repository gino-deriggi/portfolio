/* Theme, scroll reveals and restrained interaction for the portfolio. */
(() => {
  'use strict';

  const racine = document.documentElement;
  const boutonTheme = document.querySelector('.theme-toggle');
  const langue = racine.lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';

  function actualiserBoutonTheme() {
    if (!boutonTheme) return;
    const sombre = racine.dataset.theme === 'dark';
    boutonTheme.setAttribute('aria-pressed', String(sombre));
    boutonTheme.setAttribute('aria-label', langue === 'fr'
      ? (sombre ? 'Activer le mode jour' : 'Activer le mode nuit')
      : (sombre ? 'Switch to light mode' : 'Switch to dark mode'));
    boutonTheme.title = langue === 'fr' ? 'Changer de thème' : 'Toggle color theme';
  }

  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (boutonTheme) {
    actualiserBoutonTheme();
    let changementEnCours = false;
    boutonTheme.addEventListener('click', () => {
      if (changementEnCours) return;
      changementEnCours = true;
      boutonTheme.classList.add('is-switching');
      boutonTheme.setAttribute('aria-busy', 'true');
      window.setTimeout(() => {
        const theme = racine.dataset.theme === 'dark' ? 'light' : 'dark';
        racine.dataset.theme = theme;
        try { localStorage.setItem('portfolio-theme', theme); } catch (erreur) { /* Theme remains usable without storage. */ }
        actualiserBoutonTheme();
        boutonTheme.classList.remove('is-switching');
        boutonTheme.removeAttribute('aria-busy');
        changementEnCours = false;
      }, mouvementReduit ? 0 : 360);
    });
  }

  const segmentsCompetences = document.querySelectorAll('.skills-section .skill-segment.is-filled');
  segmentsCompetences.forEach((segment, index) => {
    segment.style.setProperty('--skill-segment-order', String(index));
  });

  // Mark every content unit only when JS is running; without JS it remains visible.
  const selecteursReveal = 'main section, h1, h2, h3, .skill-group, .skill-card, .timeline > li, .contact > p, .contact .email, .site-footer';
  document.querySelectorAll(selecteursReveal).forEach((element) => element.classList.add('reveal'));
  const compteursParParent = new Map();
  document.querySelectorAll('.reveal').forEach((element) => {
    const parent = element.parentElement;
    const ordre = compteursParParent.get(parent) || 0;
    element.style.setProperty('--reveal-delay', `${Math.min(ordre, 6) * 75}ms`);
    compteursParParent.set(parent, ordre + 1);
  });
  const elementsReveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !mouvementReduit) {
    const observateur = new IntersectionObserver((entrees, instance) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          instance.unobserve(entree.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    elementsReveal.forEach((element) => observateur.observe(element));
  } else {
    elementsReveal.forEach((element) => element.classList.add('visible'));
  }

  // One page-wide ripple (including buttons and links), without intercepting the pointer.
  document.addEventListener('pointerdown', (evenement) => {
    if (mouvementReduit) return;

    const cercle = document.createElement('span');
    cercle.className = 'page-ripple';
    cercle.setAttribute('aria-hidden', 'true');
    cercle.style.left = `${evenement.clientX}px`;
    cercle.style.top = `${evenement.clientY}px`;
    cercle.addEventListener('animationend', () => cercle.remove(), { once: true });
    cercle.addEventListener('animationcancel', () => cercle.remove(), { once: true });
    document.body.appendChild(cercle);
  }, true);
})();
