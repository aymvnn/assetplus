/* ========================================
   ASSET+ — Cookie Consent Banner
   Minimal, GDPR-aware, brutalist style
======================================== */

(function () {
  'use strict';

  const COOKIE_NAME = 'assetplus_consent';
  const COOKIE_DAYS = 365;

  // Check if already consented
  if (getCookie(COOKIE_NAME)) return;

  // Create banner
  const banner = document.createElement('div');
  banner.id = 'cookieConsent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <div class="cookie-content">
      <p class="cookie-text">
        This website uses essential cookies to ensure proper functionality. We do not use tracking or advertising cookies.
        <a href="privacy-policy.html" class="cookie-link">Privacy Policy</a>
      </p>
      <div class="cookie-actions">
        <button id="cookieAccept" class="cookie-btn cookie-btn-accept">Accept</button>
        <button id="cookieDecline" class="cookie-btn cookie-btn-decline">Decline</button>
      </div>
    </div>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #cookieConsent {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background: #0A0A0A;
      border-top: 1px solid rgba(204, 0, 0, 0.3);
      padding: 1rem 5vw;
      transform: translateY(100%);
      animation: cookieSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 1.5s forwards;
    }

    @keyframes cookieSlideUp {
      to { transform: translateY(0); }
    }

    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .cookie-text {
      font-family: 'Space Mono', monospace;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
      margin: 0;
    }

    .cookie-link {
      color: #CC0000;
      text-decoration: none;
    }

    .cookie-link:hover {
      text-decoration: underline;
    }

    .cookie-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .cookie-btn {
      font-family: 'Space Mono', monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      padding: 0.6rem 1.2rem;
      border: 1px solid;
      cursor: pointer;
      transition: all 0.3s ease;
      background: transparent;
    }

    .cookie-btn-accept {
      border-color: #CC0000;
      color: #CC0000;
    }

    .cookie-btn-accept:hover {
      background: #CC0000;
      color: #fff;
    }

    .cookie-btn-decline {
      border-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.4);
    }

    .cookie-btn-decline:hover {
      border-color: rgba(255, 255, 255, 0.4);
      color: rgba(255, 255, 255, 0.6);
    }

    @media (max-width: 768px) {
      .cookie-content {
        flex-direction: column;
        text-align: center;
      }

      .cookie-actions {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  // Insert into DOM
  document.head.appendChild(style);
  document.body.appendChild(banner);

  // Event listeners
  document.getElementById('cookieAccept').addEventListener('click', function () {
    setCookie(COOKIE_NAME, 'accepted', COOKIE_DAYS);
    closeBanner();
  });

  document.getElementById('cookieDecline').addEventListener('click', function () {
    setCookie(COOKIE_NAME, 'declined', COOKIE_DAYS);
    closeBanner();
  });

  function closeBanner() {
    banner.style.animation = 'none';
    banner.style.transform = 'translateY(0)';
    requestAnimationFrame(function () {
      banner.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      banner.style.transform = 'translateY(100%)';
      setTimeout(function () {
        banner.remove();
      }, 500);
    });
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
})();
