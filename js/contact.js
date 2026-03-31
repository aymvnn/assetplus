/* ========================================
   ASSET+ — Contact Form JS
   Validation + AJAX submission via Formspree
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;

    // Validate required fields
    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--accent)';
        field.style.transition = 'border-color 0.3s ease';
        setTimeout(() => {
          field.style.borderColor = '';
        }, 2500);
      }
    });

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('formStatus');
    const errorEl = document.getElementById('formError');

    // Update button state
    if (btn) {
      btn.textContent = 'SENDING...';
      btn.style.opacity = '0.6';
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
    }

    // Hide previous messages
    if (statusEl) statusEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Success
        form.reset();
        if (statusEl) statusEl.style.display = 'block';

        // GA4 conversion event
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            event_category: 'form',
            event_label: form.querySelector('#interest')?.value || 'general',
            value: 1
          });
        }

        // Reset button
        if (btn) {
          btn.textContent = 'Request Custom Specification →';
          btn.style.opacity = '';
          btn.disabled = false;
          btn.style.pointerEvents = '';
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (errorEl) errorEl.style.display = 'block';

      // Reset button
      if (btn) {
        btn.textContent = 'Request Custom Specification →';
        btn.style.opacity = '';
        btn.disabled = false;
        btn.style.pointerEvents = '';
      }
    }
  });
});
