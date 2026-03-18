(function () {
  var CONSENT_KEY = 'restartis_consent';

  function updateConsent(granted) {
    var state = granted ? 'granted' : 'denied';
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'update', {
      'ad_storage': state,
      'ad_user_data': state,
      'ad_personalization': state,
      'analytics_storage': state
    });
  }

  function hideBanner(banner) {
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity = '0';
    setTimeout(function () { banner.remove(); }, 400);
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<div style="max-width:720px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between;">' +
        '<p style="margin:0;flex:1;min-width:220px;font-size:14px;line-height:1.6;color:#0A0F2C;">' +
          'Używamy plików cookie do analizy ruchu i wyświetlania dopasowanych reklam. ' +
          'Możesz zaakceptować lub odrzucić ich użycie.' +
        '</p>' +
        '<div style="display:flex;gap:10px;flex-shrink:0;">' +
          '<button id="cookie-reject" style="padding:10px 20px;border:1.5px solid #0A0F2C;background:transparent;color:#0A0F2C;border-radius:8px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:600;">Odrzuć</button>' +
          '<button id="cookie-accept" style="padding:10px 20px;border:none;background:#0A0F2C;color:#fff;border-radius:8px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:600;">Akceptuj</button>' +
        '</div>' +
      '</div>';

    Object.assign(banner.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: '#F7F8FC',
      borderTop: '1px solid #E2E8F0',
      padding: '18px 24px',
      zIndex: '99999',
      boxShadow: '0 -4px 24px rgba(10,15,44,0.10)',
      transform: 'translateY(0)',
      opacity: '1',
      transition: 'transform 0.4s ease, opacity 0.4s ease',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    });

    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'granted');
      updateConsent(true);
      hideBanner(banner);
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'denied');
      updateConsent(false);
      hideBanner(banner);
    });
  }

  var stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted') {
    updateConsent(true);
  } else if (stored === 'denied') {
    updateConsent(false);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
