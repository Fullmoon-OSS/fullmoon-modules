// market.fullmoon.ink — renders the integration catalog.
//
// Data source: the registry JSON in Fullmoon-OSS/fullmoon-sdk (single source
// of truth). The page is static, so the catalog updates the moment a
// registration PR merges — no rebuild, no deploy. raw.githubusercontent.com
// sends CORS `*`, so the browser fetches it directly.
//
// Community strings land in the DOM, so everything goes through esc() — the
// registry is operator-reviewed, but the renderer does not trust input.

(() => {
  'use strict';

  // Data source can be overridden with ?registry=<url> for local testing,
  // but ONLY same-origin values: a cross-origin override would let a crafted
  // link render an attacker's fake catalog on this trusted domain (phishing
  // under the official site), so those are ignored. Production always uses
  // the SDK repo's registry.
  let overrideUrl = null;
  try {
    const requested = new URLSearchParams(location.search).get('registry');
    const resolved = new URL(requested ?? '', location.href);
    if (requested && resolved.origin === location.origin) overrideUrl = resolved.href;
  } catch { /* garbage query value -> fall through to production registry */ }
  const REGISTRY_URL =
    overrideUrl ??
    'https://raw.githubusercontent.com/Fullmoon-OSS/fullmoon-sdk/main/registry/integrations.json';

  const TYPES = {
    bot: '봇',
    dashboard: '대시보드',
    tool: '도구',
    client: '클라이언트',
  };

  const grid = document.getElementById('grid');
  const countEl = document.getElementById('count');
  const filtersEl = document.getElementById('filters');
  const errorEl = document.getElementById('error');
  const retryEl = document.getElementById('retry');

  let entries = [];
  let activeType = 'all';

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  // Registry entries are operator-reviewed (the validator only accepts https),
  // but the renderer does not trust input: hrefs are pinned to https and every
  // interpolated string is escaped, so a hostile registry entry still cannot
  // inject markup or a javascript: URL.
  const safeUrl = (u) => {
    const s = String(u ?? '');
    return s.startsWith('https://') ? esc(s) : '#';
  };

  function cardHtml(e) {
    const type = TYPES[e.type] ?? e.type;
    const verified = e.verified
      ? '<span class="card__verified" title="운영자가 실제 트래픽과 철칙 준수를 확인했어요">운영 확인</span>'
      : '';
    return `
      <article class="card">
        <div class="card__head">
          <span class="card__type">${esc(type)}</span>
          ${verified}
        </div>
        <h3 class="card__name"><a href="${safeUrl(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.name)}</a></h3>
        <p class="card__desc">${esc(e.description)}</p>
        <div class="card__meta">
          <span>@${esc(e.author)}</span>
          <span>${esc(e.addedAt)}</span>
        </div>
      </article>`;
  }

  function visible() {
    return activeType === 'all' ? entries : entries.filter((e) => e.type === activeType);
  }

  function render() {
    const list = visible();

    if (list.length === 0) {
      const what = activeType === 'all' ? '' : `${esc(TYPES[activeType] ?? '')} 유형의 `;
      grid.innerHTML = `
        <p class="state">아직 ${what}등록이 없어요.
        첫 번째 주인공이 되어보세요 —
        <a href="https://github.com/Fullmoon-OSS/fullmoon-sdk/blob/main/INTEGRATIONS.md">등록 절차</a>로 갈 수 있어요.</p>`;
    } else {
      grid.innerHTML = list.map(cardHtml).join('');
    }

    countEl.textContent = `등록 ${entries.length}건 · 표시 ${list.length}건`;
  }

  function renderFilters() {
    const counts = {};
    for (const e of entries) counts[e.type] = (counts[e.type] ?? 0) + 1;

    const buttons = [
      { key: 'all', label: '전체', n: entries.length },
      ...Object.keys(TYPES)
        .filter((k) => counts[k])
        .map((k) => ({ key: k, label: TYPES[k], n: counts[k] })),
    ];

    filtersEl.innerHTML = '';
    for (const b of buttons) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter';
      btn.textContent = `${b.label} ${b.n}`;
      btn.setAttribute('aria-pressed', String(b.key === activeType));
      btn.addEventListener('click', () => {
        activeType = b.key;
        for (const el of filtersEl.children) el.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-pressed', 'true');
        render();
      });
      filtersEl.appendChild(btn);
    }
  }

  function showError() {
    errorEl.classList.remove('state--hidden');
  }

  async function load() {
    errorEl.classList.add('state--hidden');
    // cache-bust: raw.githubusercontent serves with a short cache; a fresh
    // query string keeps the catalog honest across repeat visits.
    const bust = REGISTRY_URL + '?t=' + Date.now();
    let data;
    try {
      const res = await fetch(bust);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      data = await res.json();
    } catch {
      grid.innerHTML = '';
      showError();
      return;
    }

    entries = Array.isArray(data?.integrations) ? data.integrations : [];
    activeType = 'all';
    renderFilters();
    render();
  }

  retryEl.addEventListener('click', () => {
    grid.innerHTML = '<p class="state">카탈로그를 불러오는 중이에요…</p>';
    load();
  });

  load();
})();
