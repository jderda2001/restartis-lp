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

  function hideModal(overlay) {
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.remove(); }, 300);
  }

  function showModal() {
    var overlay = document.createElement('div');
    overlay.id = 'cookie-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(10,15,44,0.65)',
      zIndex: '99999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      opacity: '1',
      transition: 'opacity 0.3s ease',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    });

    var modal = document.createElement('div');
    Object.assign(modal.style, {
      background: '#fff',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '480px',
      width: '100%',
      boxShadow: '0 24px 80px rgba(10,15,44,0.25)'
    });

    modal.innerHTML =
      '<h2 style="margin:0 0 16px;font-size:18px;font-weight:800;color:#0A0F2C;">Pliki cookie</h2>' +
      '<p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#64748B;">' +
        'Używamy plików cookie do analizy ruchu i wyświetlania dopasowanych reklam. ' +
        'Twoje dane są przetwarzane zgodnie z RODO. ' +
        'Wybierz czy wyrażasz na to zgodę.' +
      '</p>' +
      '<div style="display:flex;gap:10px;">' +
        '<button id="cookie-reject" style="flex:1;padding:12px;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:600;">Odrzuć</button>' +
        '<button id="cookie-accept" style="flex:1;padding:12px;border:none;background:#0A0F2C;color:#fff;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:700;">Akceptuj wszystkie</button>' +
      '</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'granted');
      updateConsent(true);
      hideModal(overlay);
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'denied');
      updateConsent(false);
      hideModal(overlay);
    });
  }

  var stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted') {
    updateConsent(true);
  } else if (stored === 'denied') {
    updateConsent(false);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showModal);
    } else {
      showModal();
    }
  }
})();
