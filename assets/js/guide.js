// guide.js — 가이드 페이지의 코드 블록에 복사 버튼을 붙인다.
// CSP(script-src 'self') 때문에 인라인 스크립트는 없다 — 전부 이 파일.
// Clipboard API는 https(secure context)에서만 동작하고, 이 사이트는 항상 https다.

(function () {
  'use strict';

  function decorate(pre) {
    if (pre.dataset.copyReady === 'true') return;
    pre.dataset.copyReady = 'true';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'g-copy';
    button.textContent = '복사';
    button.setAttribute('aria-label', '코드 복사');

    button.addEventListener('click', function () {
      const code = pre.querySelector('code');
      const text = code ? code.textContent : pre.textContent;
      const done = function () {
        button.textContent = '복사됐어요';
        window.setTimeout(function () { button.textContent = '복사'; }, 1600);
      };
      const fail = function () { button.textContent = '복사 실패'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fail);
      } else {
        // 구형 브라우저 폴백: 선택 후 execCommand (https 여전히 필요 없음)
        const range = document.createRange();
        range.selectNodeContents(code || pre);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try { document.execCommand('copy') ? done() : fail(); }
        catch (e) { fail(); }
        selection.removeAllRanges();
      }
    });

    // 버튼은 스크롤 컨테이너(pre)가 아니라 figure에 붙인다 — pre 안에 두면
    // 가로 스크롤할 때 버튼이 코드와 함께 밀려나 보이지 않는다.
    const host = pre.closest('figure.g-code') || pre;
    host.appendChild(button);
  }

  function init() {
    document.querySelectorAll('pre.g-code, figure.g-code pre').forEach(decorate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
