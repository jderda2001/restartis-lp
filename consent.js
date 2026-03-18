(function () {
  var CONSENT_KEY = 'restartis_consent';

  function updateConsentCustom(analytics, ads) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'update', {
      'analytics_storage': analytics ? 'granted' : 'denied',
      'ad_storage': ads ? 'granted' : 'denied',
      'ad_user_data': ads ? 'granted' : 'denied',
      'ad_personalization': ads ? 'granted' : 'denied'
    });
  }

  function updateConsent(granted) {
    updateConsentCustom(granted, granted);
  }

  function hideModal(overlay) {
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.remove(); }, 300);
  }

  function showCustomPanel(overlay, modal) {
    modal.innerHTML =
      '<h2 style="margin:0 0 8px;font-size:18px;font-weight:800;color:#0A0F2C;">Dostosuj ustawienia</h2>' +
      '<p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#64748B;">Wybierz które pliki cookie chcesz zaakceptować.</p>' +

      '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;margin-bottom:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#F7F8FC;">' +
          '<div>' +
            '<div style="font-size:14px;font-weight:700;color:#0A0F2C;">Niezbędne</div>' +
            '<div style="font-size:12px;color:#64748B;margin-top:2px;">Wymagane do działania strony</div>' +
          '</div>' +
          '<div style="font-size:12px;font-weight:600;color:#64748B;">Zawsze aktywne</div>' +
        '</div>' +
      '</div>' +

      '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;margin-bottom:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;">' +
          '<div>' +
            '<div style="font-size:14px;font-weight:700;color:#0A0F2C;">Analityczne</div>' +
            '<div style="font-size:12px;color:#64748B;margin-top:2px;">Google Analytics — statystyki odwiedzin</div>' +
          '</div>' +
          '<label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;">' +
            '<input type="checkbox" id="toggle-analytics" style="opacity:0;width:0;height:0;">' +
            '<span id="slider-analytics" style="position:absolute;inset:0;background:#E2E8F0;border-radius:24px;cursor:pointer;transition:background 0.2s;"></span>' +
            '<span id="knob-analytics" style="position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></span>' +
          '</label>' +
        '</div>' +
      '</div>' +

      '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;margin-bottom:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;">' +
          '<div>' +
            '<div style="font-size:14px;font-weight:700;color:#0A0F2C;">Marketingowe</div>' +
            '<div style="font-size:12px;color:#64748B;margin-top:2px;">Google Ads — dopasowane reklamy</div>' +
          '</div>' +
          '<label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;">' +
            '<input type="checkbox" id="toggle-ads" style="opacity:0;width:0;height:0;">' +
            '<span id="slider-ads" style="position:absolute;inset:0;background:#E2E8F0;border-radius:24px;cursor:pointer;transition:background 0.2s;"></span>' +
            '<span id="knob-ads" style="position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></span>' +
          '</label>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;gap:10px;">' +
        '<button id="cookie-back" style="padding:12px 16px;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:600;">Wróć</button>' +
        '<button id="cookie-save" style="flex:1;padding:12px;border:none;background:#0A0F2C;color:#fff;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:700;">Zapisz ustawienia</button>' +
      '</div>';

    function setToggle(id, active) {
      document.getElementById('slider-' + id).style.background = active ? '#0A0F2C' : '#E2E8F0';
      document.getElementById('knob-' + id).style.transform = active ? 'translateX(20px)' : 'translateX(0)';
    }

    function bindToggle(id) {
      var cb = document.getElementById('toggle-' + id);
      var slider = document.getElementById('slider-' + id);
      var knob = document.getElementById('knob-' + id);
      slider.addEventListener('click', function () {
        cb.checked = !cb.checked;
        setToggle(id, cb.checked);
      });
      knob.addEventListener('click', function () {
        cb.checked = !cb.checked;
        setToggle(id, cb.checked);
      });
    }

    bindToggle('analytics');
    bindToggle('ads');

    document.getElementById('cookie-back').addEventListener('click', function () {
      showMainModal(overlay, modal);
    });

    document.getElementById('cookie-save').addEventListener('click', function () {
      var analytics = document.getElementById('toggle-analytics').checked;
      var ads = document.getElementById('toggle-ads').checked;
      var val = (analytics && ads) ? 'granted' : ((!analytics && !ads) ? 'denied' : 'custom:' + (analytics ? '1' : '0') + (ads ? '1' : '0'));
      localStorage.setItem(CONSENT_KEY, val);
      updateConsentCustom(analytics, ads);
      hideModal(overlay);
    });
  }

  function showMainModal(overlay, modal) {
    modal.innerHTML =
      '<h2 style="margin:0 0 16px;font-size:18px;font-weight:800;color:#0A0F2C;">Pliki cookie</h2>' +
      '<p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#64748B;">' +
        'Używamy plików cookie do analizy ruchu i wyświetlania dopasowanych reklam. ' +
        'Twoje dane są przetwarzane zgodnie z RODO. ' +
        'Wybierz czy wyrażasz na to zgodę.' +
      '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button id="cookie-customize" style="padding:12px 16px;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:600;">Dostosuj</button>' +
        '<button id="cookie-reject" style="flex:1;padding:12px;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:600;">Odrzuć</button>' +
        '<button id="cookie-accept" style="flex:1;padding:12px;border:none;background:#0A0F2C;color:#fff;border-radius:10px;font-size:14px;font-family:inherit;cursor:pointer;font-weight:700;">Akceptuj wszystkie</button>' +
      '</div>';

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

    document.getElementById('cookie-customize').addEventListener('click', function () {
      showCustomPanel(overlay, modal);
    });
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

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    showMainModal(overlay, modal);
  }

  var stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted') {
    updateConsent(true);
  } else if (stored === 'denied') {
    updateConsent(false);
  } else if (stored && stored.indexOf('custom:') === 0) {
    var flags = stored.replace('custom:', '');
    updateConsentCustom(flags[0] === '1', flags[1] === '1');
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showModal);
    } else {
      showModal();
    }
  }
})();
