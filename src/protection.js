/* ============================================================
   Tamizhan Movies — Anti-Devtools Protection (protection.js)
   Extracted from inline DOMContentLoaded block in index.html
   v2.6.1
   ============================================================ */

(function () {
  'use strict';

  /* ── Block right-click context menu ─────────────────────── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  /* ── Block devtools keyboard shortcuts ──────────────────── */
  document.addEventListener('keydown', function (e) {
    var blocked =
      e.code === 'F12' ||                                   // F12
      (e.ctrlKey  && e.shiftKey && e.code === 'KeyI') ||   // Ctrl+Shift+I
      (e.ctrlKey  && e.code === 'KeyU') ||                  // Ctrl+U  (view source)
      e.code === 'PrintScreen' ||                           // PrtSc
      (e.altKey   && e.code === 'F12') ||                   // Alt+F12
      (e.metaKey  && e.altKey && e.code === 'KeyU');        // Cmd+Alt+U (macOS)

    if (blocked) { e.preventDefault(); }

    /* Block Ctrl/Cmd+S (save page) */
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
    }
  });

  /* ── Block multi-touch and long-press (mobile) ──────────── */
  var touchStartTime;

  document.addEventListener('touchstart', function (e) {
    touchStartTime = Date.now();
    if (e.touches.length > 1) { e.preventDefault(); }   // pinch / two-finger
  }, { passive: false });

  document.addEventListener('touchend', function (e) {
    if (Date.now() - touchStartTime > 500) { e.preventDefault(); } // long-press
  });
})();
