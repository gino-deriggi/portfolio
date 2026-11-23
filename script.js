/* Interactions discrètes et accessibles du portfolio. */
(() => {
  'use strict';

  const racine = document.documentElement;
  const boutonTheme = document.querySelector('.theme-toggle');
  const langue = racine.lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';

  // Met à jour le nom accessible selon le thème actif et la langue de la page.
  function actualiserBoutonTheme() {
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
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch (erreur) {
        // Le thème reste utilisable même si le stockage local est indisponible.
      }
      actualiserBoutonTheme();
    });
  }

  // Anime les sections à leur entrée dans la fenêtre, sans masquer le contenu sans JS.
  const elementsReveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    // Respecte la préférence de réduction du mouvement du système.
    const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mouvementReduit) {
      elementsReveal.forEach((element) => element.classList.add('visible'));
    } else {
      const observateur = new IntersectionObserver((entrees, instance) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            entree.target.classList.add('visible');
            instance.unobserve(entree.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      elementsReveal.forEach((element) => observateur.observe(element));
    }
  } else {
    elementsReveal.forEach((element) => element.classList.add('visible'));
  }

  // Ajoute une onde courte au point d’activation des liens et boutons.
  document.querySelectorAll('a, button').forEach((controle) => {
    controle.addEventListener('pointerdown', (evenement) => {
      const rectangle = controle.getBoundingClientRect();
      controle.style.setProperty('--ripple-x', `${evenement.clientX - rectangle.left}px`);
      controle.style.setProperty('--ripple-y', `${evenement.clientY - rectangle.top}px`);
      controle.classList.remove('is-rippling');
      // Redémarre l’animation si le contrôle vient d’être pressé à nouveau.
      void controle.offsetWidth;
      controle.classList.add('is-rippling');
    });
    controle.addEventListener('animationend', (evenement) => {
      if (evenement.animationName === 'ripple') controle.classList.remove('is-rippling');
    });
  });
})();
