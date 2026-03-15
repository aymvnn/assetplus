/* ========================================
   ASSET+ — Contact Form JS
   Validation + button feedback for FormSubmit.co
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
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

    // Block submission if invalid
    if (!valid) {
      e.preventDefault();
      return;
    }

    // Valid: update button state and let form submit to FormSubmit.co
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'SENDING...';
      btn.style.opacity = '0.6';
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
    }

    // GA4 conversion event — fires when form is successfully submitted
    // Will activate once GA4 is installed (Item 1 — comes later)
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        event_category: 'form',
        event_label: form.querySelector('#interest')?.value || 'general',
        value: 1
      });
    }
  });
});
