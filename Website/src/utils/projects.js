/**
 * Gestion des filtres de projets et des modales
 */

/**
 * Wrappe chaque <img> et <video> dans .photo-gallery dans un <figure><figcaption>
 * pour afficher la description (alt ou data-caption) sous chaque media.
 */
export function wrapGalleryPhotos() {
  document.querySelectorAll('.photo-gallery').forEach(gallery => {
    // Evite de wrapper plusieurs fois
    if (gallery.dataset.wrapped) return;
    gallery.dataset.wrapped = 'true';

    // Wrapping des images
    gallery.querySelectorAll('img').forEach(img => {
      const figure = document.createElement('figure');
      const clonedImg = img.cloneNode(true);
      figure.appendChild(clonedImg);

      /* Affiche la caption seulement si un alt est fourni */
      if (img.alt && img.alt.trim()) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = img.alt.trim();
        figure.appendChild(figcaption);
      }

      img.replaceWith(figure);
    });

    // Wrapping des videos
    gallery.querySelectorAll('video').forEach(video => {
      const figure = document.createElement('figure');
      const clonedVideo = video.cloneNode(true);
      figure.appendChild(clonedVideo);

      /* Affiche la caption seulement si un data-caption est fourni */
      if (video.dataset.caption && video.dataset.caption.trim()) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = video.dataset.caption.trim();
        figure.appendChild(figcaption);
      }

      video.replaceWith(figure);
    });
  });
}

export function filterProjects(category, btn) {
  // Met a jour le style des boutons de filtre
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Affiche/cache les cartes
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    if (category === 'all') {
      card.style.display = 'block';
    } else {
      // data-category peut contenir plusieurs mots (ex: "pro rd")
      const cardCategories = card.getAttribute('data-category') || '';
      if (cardCategories.includes(category)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    // Empche le scroll de la page derriere la modale
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    // Si la lightbox est toujours ouee, ne restaure pas le scroll
    if (!document.querySelector('.lightbox-overlay.open')) {
      document.body.style.overflow = '';
    }
  }
}

/**
 * Initialiser la lightbox pour les images et videos de la galerie.
 */
export function initializeLightbox() {
  if (document.getElementById('lightbox')) return; // evite de creer des doubles

  // Cree l'element lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fermer">x</button>
    <img class="lightbox-img" src="" alt="" />
    <video class="lightbox-video" playsinline muted controls style="display:none"></video>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lightbox);

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const imgEl = lightbox.querySelector('.lightbox-img');
  const videoEl = lightbox.querySelector('.lightbox-video');
  const captionEl = lightbox.querySelector('.lightbox-caption');

  function openLightbox(src, caption, type) {
    imgEl.style.display = 'none';
    imgEl.src = '';
    videoEl.style.display = 'none';
    videoEl.src = '';

    if (type === 'video') {
      videoEl.style.display = '';
      videoEl.src = src;
      videoEl.load();
    } else {
      imgEl.style.display = '';
      imgEl.src = src;
    }

    captionEl.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // Empche le scroll de fond
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    imgEl.src = '';
    videoEl.pause();
    videoEl.src = '';
    videoEl.style.display = 'none';
    imgEl.style.display = '';
    captionEl.textContent = '';
    // Ne pas restaurer le scroll si la modale projet est encore ouverte
    if (!document.querySelector('.modal-overlay.open')) {
      document.body.style.overflow = '';
    }
  }

  // Clic sur une figure de la galerie pour ouvrir la lightbox
  document.querySelectorAll('.photo-gallery').forEach(gallery => {
    gallery.addEventListener('click', (e) => {
      const figure = e.target.closest('.photo-gallery figure');
      if (!figure) return;

      const img = figure.querySelector('img');
      const video = figure.querySelector('video');
      const captionElement = figure.querySelector('figcaption');
      const caption = captionElement ? captionElement.textContent.trim() : '';

      if (img) {
        openLightbox(img.src, caption, 'image');
      } else if (video) {
        const src = video.currentSrc || video.src || (video.querySelector('source') && video.querySelector('source').src);
        if (src) openLightbox(src, caption, 'video');
      }
    });
  });

  // Bouton fermer
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Ne pas fermer deux fois
    closeLightbox();
  });

  // Clic sur le fond sombre = fermer
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Echap pour fermer - phase capture pour bloquer le keydown des modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
      e.stopPropagation();
    }
  }, true);
}

export function initializeProjectUI() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const category = btn.getAttribute('data-category');
    if (!category) return;
    btn.addEventListener('click', () => filterProjects(category, btn));
  });

  document.querySelectorAll('.project-card[data-modal]').forEach(card => {
    const modalId = card.getAttribute('data-modal');
    if (!modalId) return;
    card.addEventListener('click', () => openModal(modalId));
  });

  document.querySelectorAll('.modal-close[data-close]').forEach(button => {
    const modalId = button.getAttribute('data-close');
    if (!modalId) return;
    button.addEventListener('click', () => closeModal(modalId));
  });

  /* Enveloppe les images et videos des galeries dans <figure> pour afficher les captions */
  wrapGalleryPhotos();

  /* Initialise la lightbox sur les images et videos des galeries */
  initializeLightbox();

  /* Ouvre automatiquement une modale si un hash de type #modal-xxx est pr�sent dans l'URL */
  const hash = window.location.hash;
  if (hash && hash.startsWith('#modal-')) {
    const modalId = hash.slice(1);
    /* Petit d�lai pour attendre le rendu de la page */
    setTimeout(() => {
      openModal(modalId);
    }, 300);
  }
}

// Ferme la modale si l'utilisateur clique en dehors (sur le fond sombre)
export function initializeModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      // Verifie que le clic est sur l'overlay et pas sur la modale elle-meme
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Ferme les modales avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}
