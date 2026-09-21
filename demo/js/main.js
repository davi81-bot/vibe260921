(function () {
  'use strict';

  var SITE = window.SITE, PROJECTS = window.PROJECTS, Art = window.Art;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function projectUrl(p) { return 'project.html?id=' + encodeURIComponent(p.id); }

  // ---------- 공통: 모바일 메뉴, 연도, 자리표시 이미지 ----------
  function initCommon() {
    var toggle = $('.nav-toggle'), nav = $('#site-nav');
    if (toggle && nav) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
      };
      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
    }
    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    $$('.art[data-seed]').forEach(function (el) {
      el.innerHTML = Art.render(Number(el.dataset.seed), el.dataset.kind);
    });
  }

  // ---------- 프로젝트 카드 ----------
  function cardHTML(p) {
    return '<li><a class="card" href="' + projectUrl(p) + '">' +
      '<div class="art">' + Art.render(p.seed, p.art) + '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta"><span>' + esc(p.year) + '</span><span>' + esc(p.type) + '</span>' +
          (p.sample ? '<span class="badge">SAMPLE</span>' : '') + '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.summary) + '</p>' +
      '</div></a></li>';
  }

  // ---------- Home: 대표 프로젝트 ----------
  function initHome() {
    var box = $('#featured');
    if (!box) return;
    box.innerHTML = PROJECTS.slice(0, 3).map(cardHTML).join('');
  }

  // ---------- Work: 목록 + 유형 필터 ----------
  function initWork() {
    var list = $('#work-list'), filters = $('#filters'), count = $('#work-count');
    if (!list || !filters) return;

    var types = ['전체'];
    PROJECTS.forEach(function (p) { if (types.indexOf(p.type) < 0) types.push(p.type); });
    filters.innerHTML = types.map(function (t, i) {
      return '<button type="button" class="chip" data-type="' + esc(t) + '" aria-pressed="' + (i === 0) + '">' + esc(t) + '</button>';
    }).join('');

    function show(type) {
      var items = PROJECTS.filter(function (p) { return type === '전체' || p.type === type; });
      list.innerHTML = items.length ? items.map(cardHTML).join('') : '<li class="empty">해당하는 프로젝트가 없습니다.</li>';
      count.textContent = items.length + '개 프로젝트';
      $$('button', filters).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.type === type));
      });
    }
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-type]');
      if (b) show(b.dataset.type);
    });
    show('전체');
  }

  // ---------- Project: 상세 ----------
  function initProject() {
    var root = $('#project-root');
    if (!root) return;

    var id = new URLSearchParams(location.search).get('id');
    var idx = -1;
    PROJECTS.forEach(function (p, i) { if (p.id === id) idx = i; });

    if (idx < 0) {
      document.title = '프로젝트를 찾을 수 없습니다 · 건축가 윤현석';
      root.innerHTML = '<div class="page-head"><h1>프로젝트를 찾을 수 없습니다</h1>' +
        '<p class="lede">주소가 잘못되었거나 삭제된 프로젝트입니다.</p>' +
        '<p><a class="btn" href="work.html">프로젝트 목록으로</a></p></div>';
      return;
    }

    var p = PROJECTS[idx], prev = PROJECTS[idx - 1], next = PROJECTS[idx + 1];
    document.title = p.title + ' · 건축가 ' + SITE.name;
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', p.summary);

    var others = ['louver', 'dots', 'strings', 'truchet'].filter(function (k) { return k !== p.art; });
    var gallery = [
      { art: p.art, seed: p.seed, cap: '대표 이미지' },
      { art: others[0], seed: p.seed + 100, cap: '도면·다이어그램' },
      { art: others[1], seed: p.seed + 200, cap: '상세' },
    ].map(function (g) {
      return '<figure><div class="art">' + Art.render(g.seed, g.art) + '</div><figcaption>' + g.cap + '</figcaption></figure>';
    }).join('');

    var tools = p.tools && p.tools.length
      ? '<ul class="chips">' + p.tools.map(function (t) { return '<li class="chip">' + esc(t) + '</li>'; }).join('') + '</ul>'
      : '<span class="todo">입력 예정</span>';

    var meta = [['연도', p.year], ['유형', p.type], ['역할', p.role], ['기간', p.period], ['위치', p.location], ['규모', p.scale]]
      .map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('');

    root.innerHTML =
      '<div class="page-head">' +
        '<p class="eyebrow">' + esc(p.type) + ' · ' + esc(p.year) + (p.sample ? ' · SAMPLE' : '') + '</p>' +
        '<h1>' + esc(p.title) + '</h1>' +
        '<p class="lede">' + esc(p.summary) + '</p>' +
        '<dl class="meta">' + meta + '</dl>' +
      '</div>' +
      '<div class="gallery">' + gallery + '</div>' +
      '<div class="detail-block"><h2>개요</h2><div class="prose"><p>' + esc(p.overview) + '</p></div></div>' +
      '<div class="detail-block"><h2>사용 기술</h2><div>' + tools + '</div></div>' +
      '<div class="detail-block"><h2>결과</h2><div class="prose"><p>' + esc(p.result) + '</p></div></div>' +
      (p.sample ? '<p class="note">이 프로젝트는 화면 구성을 보여주는 샘플이며, 이미지는 자동 생성된 무늬입니다. 실제 내용은 <code>js/data.js</code>에서 교체합니다.</p>' : '') +
      '<nav class="pager" aria-label="프로젝트 이동">' +
        (prev ? '<a class="prev" href="' + projectUrl(prev) + '"><small>← 이전 프로젝트</small><strong>' + esc(prev.title) + '</strong></a>' : '') +
        (next ? '<a class="next" href="' + projectUrl(next) + '"><small>다음 프로젝트 →</small><strong>' + esc(next.title) + '</strong></a>' : '') +
      '</nav>';
  }

  // ---------- Contact: 메일 작성, 주소 복사 ----------
  function initContact() {
    var form = $('#contact-form'), status = $('#form-status'), copy = $('#copy-email');

    if (copy) {
      copy.addEventListener('click', function () {
        var done = function (msg) { status.textContent = msg; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(SITE.email).then(
            function () { done('이메일 주소를 복사했습니다.'); },
            function () { done('복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.'); }
          );
        } else {
          done('복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.');
        }
      });
    }

    if (form) {
      // 서버가 없는 정적 사이트이므로, 입력 내용으로 메일 작성 창을 엽니다.
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var f = new FormData(form);
        var subject = '[' + f.get('type') + '] ' + f.get('name') + '님의 문의';
        var body = '이름: ' + f.get('name') + '\n회신 이메일: ' + f.get('email') +
          '\n문의 유형: ' + f.get('type') + '\n\n' + f.get('message');
        location.href = 'mailto:' + SITE.email +
          '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        status.textContent = '메일 프로그램이 열립니다. 열리지 않으면 ' + SITE.email + ' 로 직접 보내 주세요.';
      });
    }
  }

  initCommon();
  var page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'work') initWork();
  if (page === 'project') initProject();
  if (page === 'contact') initContact();
})();
