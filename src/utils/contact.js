/**
 * Gestion du formulaire de contact -- Formspree
 */

export function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  const formData = new FormData(form);

  /* UI Loading */
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours...';
  if (statusEl) { statusEl.style.display = 'none'; statusEl.textContent = ''; }

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = 'Message envoye ! Je vous repondrai sous 24h.';
        statusEl.style.color = '#22c55e';
        statusEl.setAttribute('tabindex', '-1');
        statusEl.focus();
      }
      form.reset();
    } else {
      throw new Error('Formspree error response');
    }
  })
  .catch(err => {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = 'Un probleme est survenu. Essayez a nouveau ou envoyez directement un email.';
      statusEl.style.color = '#ef4444';
    }
    console.error('Contact form error:', err);
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    setTimeout(() => {
      if (statusEl) { statusEl.style.display = 'none'; statusEl.removeAttribute('tabindex'); }
    }, 8000);
  });
}

export function initializeForm() {
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}
