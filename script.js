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

  if (boutonTheme) {
    actualiserBoutonTheme();
    boutonTheme.addEventListener('click', () => {
      const theme = racine.dataset.theme === 'dark' ? 'light' : 'dark';
      racine.dataset.theme = theme;
      try { localStorage.setItem('portfolio-theme', theme); } catch (erreur) { /* Theme remains usable without storage. */ }
      actualiserBoutonTheme();
    });
  }

  const elementsReveal = document.querySelectorAll('.reveal');
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  document.querySelectorAll('a, button').forEach((controle) => {
    controle.addEventListener('pointerdown', (evenement) => {
      const rectangle = controle.getBoundingClientRect();
      controle.style.setProperty('--ripple-x', `${evenement.clientX - rectangle.left}px`);
      controle.style.setProperty('--ripple-y', `${evenement.clientY - rectangle.top}px`);
      controle.classList.remove('is-rippling');
      void controle.offsetWidth;
      controle.classList.add('is-rippling');
    });
    controle.addEventListener('animationend', (evenement) => {
      if (evenement.animationName === 'ripple') controle.classList.remove('is-rippling');
    });
  });
})();
