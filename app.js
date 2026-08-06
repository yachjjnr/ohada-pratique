/* ============================================================
   OHADA PRATIQUE — Logique partagée
   - Mode clair/sombre avec persistance localStorage
   - Menu mobile, TOC scroll spy
   (la gestion des 3 marques a été retirée : la marque
   OHADA Pratique est actée depuis le 2026-05-20)
   ============================================================ */

(function () {
  const STORAGE_MODE = 'sm.mode';

  function getStored(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }
  function setStored(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function applyMode(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    setStored(STORAGE_MODE, mode);
    document.querySelectorAll('[data-mode-toggle]').forEach(btn => {
      const sun = btn.querySelector('[data-icon="sun"]');
      const moon = btn.querySelector('[data-icon="moon"]');
      if (sun && moon) {
        sun.style.display = mode === 'dark' ? 'block' : 'none';
        moon.style.display = mode === 'dark' ? 'none' : 'block';
      }
      btn.setAttribute('aria-label', mode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    });
  }

  // ------- Init -------
  document.addEventListener('DOMContentLoaded', () => {
    const mode = getStored(STORAGE_MODE, 'light');
    applyMode(mode);

    // Mode toggle
    document.querySelectorAll('[data-mode-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
        applyMode(next);
      });
    });

    // Mobile nav
    document.querySelectorAll('[data-menu-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('[data-mobile-nav]')?.classList.toggle('open');
      });
    });

    // TOC scroll spy
    initTocSpy();
  });

  function initTocSpy() {
    const toc = document.querySelector('.toc');
    if (!toc) return;
    const links = toc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;
    const sections = Array.from(links).map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  // Expose for inline scripts if needed
  window.SiteSM = { applyMode };
})();

/* ============================================================
   Filtres de la bibliothèque (cards)
   ============================================================ */
function initLibraryFilters() {
  const cards = document.querySelectorAll('[data-guide-card]');
  if (!cards.length) return;
  const searchInput = document.querySelector('[data-library-search]');
  const filterInputs = document.querySelectorAll('[data-filter]');
  const countEl = document.querySelector('[data-results-count]');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const active = { theme: [], niveau: [], format: [] };
    filterInputs.forEach(input => {
      if (input.checked) active[input.getAttribute('data-filter')].push(input.value);
    });
    let visible = 0;
    let coming = 0;
    cards.forEach(card => {
      const theme = card.getAttribute('data-card-theme') || '';
      const niveau = card.getAttribute('data-card-niveau') || '';
      const format = card.getAttribute('data-card-format') || '';
      const text = card.textContent.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchTheme = !active.theme.length || active.theme.includes(theme);
      const matchNiv = !active.niveau.length || active.niveau.includes(niveau);
      const matchFmt = !active.format.length || active.format.includes(format);
      const show = matchSearch && matchTheme && matchNiv && matchFmt;
      card.style.display = show ? '' : 'none';
      if (show) {
        if (card.classList.contains('guide-card--coming')) coming++;
        else visible++;
      }
    });
    if (countEl) {
      let label = visible + ' guide' + (visible > 1 ? 's' : '');
      if (coming) label += ' + ' + coming + ' à venir';
      countEl.textContent = label;
    }
  }
  searchInput?.addEventListener('input', applyFilters);
  filterInputs.forEach(i => i.addEventListener('change', applyFilters));
  applyFilters();
}
document.addEventListener('DOMContentLoaded', initLibraryFilters);

/* ============================================================
   Compteur de ressources de la bibliothèque
   La source de vérité est le nombre de cartes [data-guide-card]
   dans bibliotheque.html ; les chiffres en dur ne servent que de
   valeur par défaut si le JS ou le fetch échoue.
   ============================================================ */
function initBiblioStats() {
  // Seules les ressources disponibles comptent (on exclut les cartes "à venir")
  const SEL = '[data-guide-card]:not(.guide-card--coming)';
  // Sur bibliotheque.html : compter les cartes de la page
  const totalEls = document.querySelectorAll('[data-biblio-total]');
  if (totalEls.length) {
    const total = document.querySelectorAll(SEL).length;
    if (total) totalEls.forEach(el => { el.textContent = total; });
  }
  // Sur les autres pages (accueil) : aller compter dans bibliotheque.html
  const remoteEls = document.querySelectorAll('[data-biblio-total-remote]');
  if (remoteEls.length && location.protocol !== 'file:') {
    fetch('bibliotheque.html')
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const total = doc.querySelectorAll(SEL).length;
        if (total) remoteEls.forEach(el => { el.textContent = total; });
      })
      .catch(() => { /* on garde la valeur par défaut du HTML */ });
  }
}
document.addEventListener('DOMContentLoaded', initBiblioStats);

/* ============================================================
   Calculatrice d'amortissement linéaire
   ============================================================ */
function initAmortCalculator() {
  const form = document.getElementById('amort-form');
  if (!form) return;

  const $ = (id) => document.getElementById(id);

  function fmtFCFA(n) {
    if (!isFinite(n)) return '—';
    return Math.round(n).toLocaleString('fr-FR') + ' FCFA';
  }

  function compute() {
    const valeur = parseFloat($('amort-valeur').value) || 0;
    const duree = parseInt($('amort-duree').value, 10) || 0;
    const dateMiseService = $('amort-date').value;
    const mode = $('amort-mode').value;

    if (valeur <= 0 || duree <= 0 || !dateMiseService) {
      $('amort-summary').innerHTML = '<p class="muted text-sm">Renseigne la valeur, la durée et la date de mise en service.</p>';
      $('amort-table-body').innerHTML = '';
      return;
    }

    const tauxLineaire = 1 / duree;
    const annuiteEntiere = valeur * tauxLineaire;
    const tauxDegressif = mode === 'degressif' ? tauxLineaire * coeffDegressif(duree) : tauxLineaire;

    // Prorata temporis sur la première année (en jours, base 360 OHADA)
    const startDate = new Date(dateMiseService);
    const anneeMS = startDate.getFullYear();
    const moisMS = startDate.getMonth(); // 0-11
    const jourMS = startDate.getDate();
    // OHADA : prorata en jours (méthode des 360 jours, "30/360")
    const joursPremiereAnnee = Math.max(0, 360 - ((moisMS) * 30 + (jourMS - 1)));
    const proratasPremiere = joursPremiereAnnee / 360;

    const rows = [];
    let vnc = valeur;
    let exo = anneeMS;
    let n = 0;
    const limit = duree + 2; // safety

    if (mode === 'lineaire') {
      // Année 1 : prorata
      let amort1 = annuiteEntiere * proratasPremiere;
      rows.push({ exo, base: valeur, taux: tauxLineaire, amort: amort1, cumul: amort1, vnc: valeur - amort1 });
      vnc -= amort1;
      exo++;
      // Années suivantes pleines
      let cumul = amort1;
      while (n < duree && vnc > 0.01) {
        let amort = annuiteEntiere;
        // Dernière ligne : ajuste au reliquat
        if (cumul + amort > valeur || (n === duree - 1 && proratasPremiere < 1)) {
          amort = valeur - cumul;
        }
        cumul += amort;
        vnc = valeur - cumul;
        rows.push({ exo, base: valeur, taux: tauxLineaire, amort, cumul, vnc });
        exo++; n++;
        if (vnc < 0.01) break;
      }
    } else {
      // Dégressif (OHADA) : taux dégressif jusqu'à ce que linéaire >= dégressif
      let cumul = 0;
      let i = 0;
      while (i < duree && vnc > 0.01) {
        const restant = duree - i;
        const tauxLineRestant = 1 / restant;
        let taux = Math.max(tauxLineRestant, tauxDegressif);
        let amort = vnc * taux;
        if (i === 0) amort *= proratasPremiere;
        if (cumul + amort > valeur) amort = valeur - cumul;
        cumul += amort;
        const newVnc = valeur - cumul;
        rows.push({ exo, base: vnc, taux, amort, cumul, vnc: newVnc });
        vnc = newVnc;
        exo++; i++;
        if (i > limit) break;
      }
    }

    // Render summary
    const tauxAffiche = (mode === 'lineaire' ? tauxLineaire : tauxDegressif) * 100;
    $('amort-summary').innerHTML = `
      <div class="metric">
        <span class="metric-label">Annuité (année pleine)</span>
        <span class="metric-value">${fmtFCFA(annuiteEntiere)}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Taux ${mode === 'degressif' ? 'dégressif' : 'linéaire'}</span>
        <span class="metric-value">${tauxAffiche.toFixed(2)} <small>%</small></span>
      </div>
      <div class="metric">
        <span class="metric-label">Prorata 1<sup>re</sup> année</span>
        <span class="metric-value">${(proratasPremiere * 100).toFixed(1)} <small>%</small> · ${joursPremiereAnnee} jours</span>
      </div>
    `;

    // Render table
    $('amort-table-body').innerHTML = rows.map(r => `
      <tr>
        <td>${r.exo}</td>
        <td class="num">${fmtFCFA(r.base)}</td>
        <td class="num">${(r.taux * 100).toFixed(2)} %</td>
        <td class="num">${fmtFCFA(r.amort)}</td>
        <td class="num">${fmtFCFA(r.cumul)}</td>
        <td class="num">${fmtFCFA(Math.max(0, r.vnc))}</td>
      </tr>
    `).join('');
  }

  // Coefficient dégressif OHADA : 1.5 (3-4 ans), 2 (5-6 ans), 2.5 (> 6 ans)
  function coeffDegressif(d) {
    if (d <= 2) return 1;
    if (d <= 4) return 1.5;
    if (d <= 6) return 2;
    return 2.5;
  }

  form.addEventListener('input', compute);
  form.addEventListener('change', compute);
  compute();
}
document.addEventListener('DOMContentLoaded', initAmortCalculator);

/* ============================================================
   Quiz — interactivité (correction immédiate, score, explication)
   ============================================================ */
function initQuiz() {
  const quiz = document.querySelector('[data-quiz]');
  if (!quiz) return;
  const questions = quiz.querySelectorAll('[data-question]');
  const total = questions.length;
  let answered = 0;
  let correct = 0;

  questions.forEach((q) => {
    const options = q.querySelectorAll('[data-option]');
    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        if (q.classList.contains('answered')) return;
        q.classList.add('answered');
        const isCorrect = opt.hasAttribute('data-correct');
        if (isCorrect) correct++;
        answered++;
        options.forEach(o => {
          if (o.hasAttribute('data-correct')) o.classList.add('correct');
          else o.classList.add('incorrect');
        });
        if (!isCorrect) opt.classList.add('user-picked');
        // Progress display
        const counter = quiz.querySelector('[data-quiz-progress]');
        if (counter) counter.textContent = `Question ${answered} / ${total}`;
        // Final result
        if (answered === total) {
          const result = quiz.querySelector('[data-quiz-result]');
          if (result) {
            result.classList.add('shown');
            const scoreEl = result.querySelector('[data-quiz-score]');
            if (scoreEl) scoreEl.innerHTML = `<span class="accent">${correct}</span> / ${total}`;
            const msgEl = result.querySelector('[data-quiz-msg]');
            if (msgEl) {
              let msg;
              if (correct === total) msg = "Sans faute. Tu peux passer au guide suivant.";
              else if (correct >= total - 1) msg = "Très bon score. Une révision ciblée et tout est calé.";
              else if (correct >= total / 2) msg = "Bonne base. Reprends les passages que tu as ratés.";
              else msg = "Il y a encore du travail. Relis la section et reviens.";
              msgEl.textContent = msg;
            }
          }
        }
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', initQuiz);

/* ============================================================
   Fade-in subtil à l'apparition (IntersectionObserver)
   ============================================================ */
function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initFadeIn);

/* ============================================================
   Glossaire — filtre alphabétique
   ============================================================ */
function initGlossary() {
  const search = document.querySelector('[data-glossary-search]');
  const items = document.querySelectorAll('[data-glossary-item]');
  if (!search || !items.length) return;
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    items.forEach(item => {
      const term = item.querySelector('dt')?.textContent.toLowerCase() || '';
      const def = item.querySelector('dd')?.textContent.toLowerCase() || '';
      item.style.display = (term.includes(q) || def.includes(q)) ? '' : 'none';
    });
  });
}
document.addEventListener('DOMContentLoaded', initGlossary);
