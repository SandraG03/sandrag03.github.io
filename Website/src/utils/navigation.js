/**
 * Navigation accessible - multi-page statique
 */

export function initializeNavigation() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    // Toggle menu
    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    burger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });

    // Escape fermer menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });

    // Fermer le menu au clic hors nav
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !burger.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Liens du nav - fermer menu au clic
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
      if (burger) burger.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-action]').forEach(button => {
    const action = button.getAttribute('data-action');
    if (!action) return;
    button.addEventListener('click', () => {
      const target = action === 'home' ? 'index.html' : `${action}.html`;
      window.location.href = target;
    });
  });

  highlightActiveLink();
}

function highlightActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = path === '' ? 'index.html' : path;

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
