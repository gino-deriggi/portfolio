/* =====================================================
   PORTFOLIO - Gino De Riggi
   ===================================================== */

const reduireMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tactile = window.matchMedia("(hover: none)").matches;

/* =====================================================
   1) THÈME
   ===================================================== */
const racine = document.documentElement;
const btnTheme = document.getElementById("btn-theme");

function appliquerTheme(theme) {
    racine.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

const themeSauve = localStorage.getItem("theme");
const prefereClair = window.matchMedia("(prefers-color-scheme: light)").matches;
appliquerTheme(themeSauve || (prefereClair ? "light" : "dark"));

btnTheme.addEventListener("click", () => {
    const actuel = racine.getAttribute("data-theme");
    appliquerTheme(actuel === "dark" ? "light" : "dark");
});

/* =====================================================
   2) LANGUE FR / EN
   ===================================================== */
const btnLangue = document.getElementById("btn-langue");
let langue = localStorage.getItem("langue") || "fr";

const messages = {
    fr: { copie: "Adresse copiée ✓", erreur: "Copie impossible" },
    en: { copie: "Address copied ✓", erreur: "Copy failed" }
};

const phrases = {
    fr: [
        "étudiant en Réseaux & Télécommunications",
        "IUT de Béziers",
        "passionné de réseau et de code"
    ],
    en: [
        "Networks & Telecommunications student",
        "IUT of Béziers",
        "passionate about networks and code"
    ]
};

function formaterNote(valeur) {
    const texte = String(valeur);
    return langue === "fr" ? texte.replace(".", ",") : texte;
}

function appliquerLangue(lang) {
    langue = lang;
    racine.lang = lang;
    localStorage.setItem("langue", lang);
    btnLangue.textContent = lang === "fr" ? "EN" : "FR";

    document.querySelectorAll("[data-fr]").forEach((el) => {
        el.textContent = el.dataset[lang];
    });

    document.querySelectorAll(".compteur").forEach((el) => {
        el.textContent = formaterNote(el.dataset.note);
    });

    redemarrerMachine();
}

btnLangue.addEventListener("click", () => {
    appliquerLangue(langue === "fr" ? "en" : "fr");
});

/* =====================================================
   3) MACHINE À ÉCRIRE
   ===================================================== */
const zoneMachine = document.getElementById("machine");
let timerMachine;
let indexPhrase = 0;
let indexLettre = 0;
let enEffacement = false;

function boucleMachine() {
    const liste = phrases[langue];
    const phrase = liste[indexPhrase % liste.length];

    if (!enEffacement) {
        indexLettre++;
        zoneMachine.textContent = phrase.slice(0, indexLettre);
        if (indexLettre === phrase.length) {
            enEffacement = true;
            timerMachine = setTimeout(boucleMachine, 1900);
            return;
        }
        timerMachine = setTimeout(boucleMachine, 55);
    } else {
        indexLettre--;
        zoneMachine.textContent = phrase.slice(0, indexLettre);
        if (indexLettre === 0) {
            enEffacement = false;
            indexPhrase++;
            timerMachine = setTimeout(boucleMachine, 400);
            return;
        }
        timerMachine = setTimeout(boucleMachine, 28);
    }
}

function redemarrerMachine() {
    clearTimeout(timerMachine);
    indexPhrase = 0;
    indexLettre = 0;
    enEffacement = false;

    if (reduireMouvement) {
        zoneMachine.textContent = phrases[langue][0];
        return;
    }
    boucleMachine();
}

/* =====================================================
   4) BARRE DE PROGRESSION + BOUTON RETOUR EN HAUT
   ===================================================== */
const barre = document.querySelector(".progression");
const btnHaut = document.getElementById("btn-haut");
let attenteScroll = false;

function majScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    barre.style.transform = `scaleX(${ratio})`;
    btnHaut.classList.toggle("visible", window.scrollY > 500);
    attenteScroll = false;
}

window.addEventListener("scroll", () => {
    if (!attenteScroll) {
        attenteScroll = true;
        requestAnimationFrame(majScroll);
    }
}, { passive: true });

btnHaut.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =====================================================
   5) APPARITION DES SECTIONS AU SCROLL
   ===================================================== */
const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
        if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            observateur.unobserve(entree.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observateur.observe(el));

/* =====================================================
   6) CURSEUR PERSONNALISÉ
   ===================================================== */
const curseur = document.querySelector(".curseur");

if (!tactile && !reduireMouvement) {
    let cibleX = 0;
    let cibleY = 0;
    let posX = 0;
    let posY = 0;

    window.addEventListener("mousemove", (e) => {
        cibleX = e.clientX;
        cibleY = e.clientY;
        curseur.classList.add("actif");
    });

    document.addEventListener("mouseleave", () => curseur.classList.remove("actif"));

    function animerCurseur() {
        posX += (cibleX - posX) * 0.18;
        posY += (cibleY - posY) * 0.18;
        curseur.style.transform = `translate(${posX}px, ${posY}px)`;
        requestAnimationFrame(animerCurseur);
    }
    animerCurseur();

    document.querySelectorAll("a, button, summary, .tag").forEach((el) => {
        el.addEventListener("mouseenter", () => curseur.classList.add("survol"));
        el.addEventListener("mouseleave", () => curseur.classList.remove("survol"));
    });
}

/* =====================================================
   7) LUMIÈRE QUI SUIT LA SOURIS SUR LES CARTES
   ===================================================== */
document.querySelectorAll(".lumiere").forEach((carte) => {
    carte.addEventListener("mousemove", (e) => {
        const zone = carte.getBoundingClientRect();
        carte.style.setProperty("--mx", `${e.clientX - zone.left}px`);
        carte.style.setProperty("--my", `${e.clientY - zone.top}px`);
    });
});

/* =====================================================
   8) EFFET MAGNÉTIQUE SUR LES BOUTONS
   ===================================================== */
if (!tactile && !reduireMouvement) {
    document.querySelectorAll(".magnetique").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const zone = el.getBoundingClientRect();
            const dx = e.clientX - (zone.left + zone.width / 2);
            const dy = e.clientY - (zone.top + zone.height / 2);
            el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = "";
        });
    });
}

/* =====================================================
   9) COMPÉTENCES : UNE SEULE OUVERTE + COMPTEUR ANIMÉ
   ===================================================== */
const tags = document.querySelectorAll(".tag");

function animerCompteur(el) {
    const cible = parseFloat(el.dataset.note);

    if (reduireMouvement) {
        el.textContent = formaterNote(cible);
        return;
    }

    const duree = 1000;
    const debut = performance.now();

    function etape(maintenant) {
        const progres = Math.min((maintenant - debut) / duree, 1);
        const adouci = 1 - Math.pow(1 - progres, 3);
        const valeur = Math.round(cible * adouci * 10) / 10;
        el.textContent = formaterNote(valeur);
        if (progres < 1) requestAnimationFrame(etape);
    }
    requestAnimationFrame(etape);
}

tags.forEach((tag) => {
    tag.addEventListener("toggle", () => {
        if (!tag.open) return;

        tags.forEach((autre) => {
            if (autre !== tag) autre.open = false;
        });

        animerCompteur(tag.querySelector(".compteur"));
    });
});

/* =====================================================
   10) COPIER L'EMAIL
   ===================================================== */
const btnCopier = document.getElementById("btn-copier");
const toast = document.getElementById("toast");
let timerToast;

function afficherToast(texte) {
    toast.textContent = texte;
    toast.classList.add("visible");
    clearTimeout(timerToast);
    timerToast = setTimeout(() => toast.classList.remove("visible"), 2200);
}

btnCopier.addEventListener("click", async () => {
    const adresse = document.querySelector(".mail").textContent.trim();
    try {
        await navigator.clipboard.writeText(adresse);
        afficherToast(messages[langue].copie);
    } catch (erreur) {
        afficherToast(messages[langue].erreur);
    }
});

/* =====================================================
   11) DÉMARRAGE
   ===================================================== */
appliquerLangue(langue);
majScroll();