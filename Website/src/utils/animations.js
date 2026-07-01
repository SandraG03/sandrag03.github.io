/**
 * Animations du terminal et du contenu
 *
 * Structure HTML attendue :
 *
 * <div class="hero-terminal fade-up">
 *   <!-- Ligne de commentaire optionnelle, ignorée par l'animation -->
 *   <div class="terminal-line">
 *     <span class="prompt">$ </span>
 *     <span class="comment"># Un commentaire</span>
 *   </div>
 *
 *   <!-- Un bloc = un prompt + ses outputs -->
 *   <div class="terminal-block">
 *     <div class="terminal-line">
 *       <span class="prompt">$ </span>
 *       <span class="typed-text" data-text="whoami"></span><span class="cursor"></span>
 *     </div>
 *     <div class="terminal-line terminal-output" style="opacity:0">
 *       <span class="output">→ Résultat 1</span>
 *     </div>
 *     <div class="terminal-line terminal-output" style="opacity:0">
 *       <span class="output">→ Résultat 2</span>
 *     </div>
 *   </div>
 *
 *   <!-- Autant de blocs que voulu -->
 *   <div class="terminal-block">
 *     ...
 *   </div>
 * </div>
 */

/**
 * Anime tous les terminaux de la page.
 * Chaque terminal démarre uniquement quand il est entièrement visible,
 * en tenant compte de l'animation fade-up.
 */
export function animateTerminal() {
  const terminals = document.querySelectorAll('.hero-terminal');

  terminals.forEach(terminal => {
    // Attend que le terminal soit visible avant de démarrer
    waitForVisibility(terminal, () => {
      animateSingleTerminal(terminal);
    });
  });
}

/**
 * Observe un élément et appelle `callback` une seule fois
 * quand il est considéré comme "entièrement visible" (après fade-up).
 * On attend que l'élément ait la classe `visible` (ajoutée par triggerAnimations)
 * ET qu'il soit dans le viewport.
 */
function waitForVisibility(element, callback) {
  // Cas 1 : le terminal n'a pas de fade-up, on observe juste l'intersection
  if (!element.classList.contains('fade-up')) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          obs.disconnect();
          callback();
        }
      });
    }, { threshold: 0.8 }); // 80% visible pour s'assurer que c'est bien affiché
    observer.observe(element);
    return;
  }

  // Cas 2 : le terminal a fade-up → on attend qu'il ait la classe `visible`
  // (ajoutée par triggerAnimations via IntersectionObserver)
  // puis on déclenche l'animation
  const checkVisible = new MutationObserver(() => {
    if (element.classList.contains('visible')) {
      checkVisible.disconnect();
      // Petit délai pour laisser le temps à la transition CSS de se terminer
      const transitionDuration = getTransitionDuration(element);
      setTimeout(callback, transitionDuration);
    }
  });

  // Si déjà visible au chargement
  if (element.classList.contains('visible')) {
    const transitionDuration = getTransitionDuration(element);
    setTimeout(callback, transitionDuration);
    return;
  }

  checkVisible.observe(element, { attributes: true, attributeFilter: ['class'] });
}

/**
 * Récupère la durée de transition CSS d'un élément en ms.
 * Utile pour attendre la fin du fade-up avant de taper.
 */
function getTransitionDuration(element) {
  const style = window.getComputedStyle(element);
  const duration = style.transitionDuration || '0s';
  // Prend la plus longue des durées (si plusieurs propriétés animées)
  const values = duration.split(',').map(v => parseFloat(v.trim()) * 1000);
  return Math.max(...values, 0);
}

/**
 * Anime un terminal : tape les prompts et affiche les outputs
 * bloc par bloc, dans l'ordre.
 */
function animateSingleTerminal(terminal) {
  const blocks = terminal.querySelectorAll('.terminal-block');
  if (!blocks.length) return;

  // Lance les blocs en séquence (chaque bloc attend la fin du précédent)
  animateBlockSequence([...blocks], 0);
}

/**
 * Récursion : anime les blocs les uns après les autres.
 */
function animateBlockSequence(blocks, index) {
  if (index >= blocks.length) return;

  const block = blocks[index];
  const typedEl = block.querySelector('.typed-text');
  const outputs = block.querySelectorAll('.terminal-output');
  const text = typedEl ? (typedEl.getAttribute('data-text') || '') : '';

  // Réinitialise le texte (utile si l'animation est rejouée)
  if (typedEl) typedEl.textContent = '';

  // 1. Tape le prompt
  typeText(typedEl, text, 50, () => {
    // 2. Affiche les outputs les uns après les autres
    revealOutputs([...outputs], 0, 500, () => {
      // 3. Passe au bloc suivant avec un délai entre blocs
      setTimeout(() => animateBlockSequence(blocks, index + 1), 400);
    });
  });
}

/**
 * Tape un texte caractère par caractère dans un élément.
 * @param {Element} element  - Élément cible
 * @param {string}  text     - Texte à taper
 * @param {number}  speed    - Délai entre chaque caractère (ms)
 * @param {Function} onDone  - Callback appelé quand le texte est entier
 */
function typeText(element, text, speed, onDone) {
  if (!element || !text) {
    onDone?.();
    return;
  }

  let i = 0;
  function step() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(step, speed);
    } else {
      onDone?.();
    }
  }
  step();
}

/**
 * Révèle les outputs les uns après les autres.
 * @param {Element[]} outputs  - Liste des éléments outputs
 * @param {number}    index    - Index courant
 * @param {number}    delay    - Délai entre chaque output (ms)
 * @param {Function}  onDone   - Callback quand tous les outputs sont affichés
 */
function revealOutputs(outputs, index, delay, onDone) {
  if (index >= outputs.length) {
    onDone?.();
    return;
  }

  setTimeout(() => {
    outputs[index].style.opacity = '1';
    revealOutputs(outputs, index + 1, delay, onDone);
  }, delay);
}


// ─── Autres animations ────────────────────────────────────────────────────────

export function triggerAnimations() {
  const elements = document.querySelectorAll('.fade-up:not(.visible)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));

  animateSkillBars();
}

export function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}


