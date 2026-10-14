/* ==========================================================================
   Shared behaviour for the sign-in flow (mockup only — nothing is submitted).

   • Carries the account name ("email") from step to step, through the
     ?email= query string and then localStorage, falling back to the
     address used in the reference captures: test@test.com
   • Keeps the links between steps pointing at the same account
   • Wires the back arrow / dismiss (X) buttons in the card banner

   Exposes window.Flow = { email } so each page can add its own behaviour.
   ========================================================================== */

(function () {
  'use strict';

  var EMAIL_KEY = 'msft-demo-email';
  var DEFAULT_EMAIL = 'test@test.com';
  var STEPS = ['index.html', 'enter-password.html', 'get-a-code.html'];

  /* ── Which account are we signing in? ─────────────────────────────────── */
  function readEmail() {
    var fromQuery = new URLSearchParams(window.location.search).get('email');
    if (fromQuery) {
      store.setItem(EMAIL_KEY, fromQuery);
      return fromQuery;
    }
    var saved = store.getItem(EMAIL_KEY);
    return saved || DEFAULT_EMAIL;
  }

  /* localStorage can throw in private mode / file:// sandboxes — never fatal */
  var store = {
    getItem: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    setItem: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* ── Keep the ?email= parameter on links between the steps ────────────── */
  function linkWithEmail(href, email) {
    var base = href.split('#')[0];
    var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
    return base + (base.indexOf('?') > -1 ? '&' : '?') +
      'email=' + encodeURIComponent(email) + hash;
  }

  function isStepLink(anchor) {
    var href = anchor.getAttribute('href') || '';
    return STEPS.some(function (step) {
      return href === step || href.indexOf(step + '?') === 0 || href.indexOf(step + '#') === 0;
    });
  }

  function applyEmail(email) {
    document.querySelectorAll('[data-email]').forEach(function (el) {
      el.textContent = email;
    });

    document.querySelectorAll('a').forEach(function (anchor) {
      if (isStepLink(anchor)) {
        anchor.setAttribute('href', linkWithEmail(anchor.getAttribute('href'), email));
      }
    });

    document.title = document.title; // unchanged; keeps copy/paste honest
  }

  /* ── Banner navigation (back arrow on the password step, X on the code step) */
  function wireNavigation(email) {
    document.querySelectorAll('[data-nav]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = button.getAttribute('data-nav') || 'index.html';
        window.Flow.goTo(linkWithEmail(target, email));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var email = readEmail();

    window.Flow = {
      email: email,
      goTo: function (url) { window.location.href = url; },
      withEmail: function (href) { return linkWithEmail(href, email); }
    };

    applyEmail(email);
    wireNavigation(email);
  });
})();
