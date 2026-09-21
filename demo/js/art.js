/*
 * 파라메트릭 이미지 생성기
 * 프로젝트 사진이 준비되기 전까지 쓰는 자리표시 이미지입니다.
 * seed가 같으면 항상 같은 무늬가 나옵니다.
 */
(function () {
  'use strict';

  var W = 400, H = 300;
  var ACCENT = 'style="fill:var(--accent)"';
  var ACCENT_STROKE = 'style="stroke:var(--accent)"';

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function n(v) { return Math.round(v * 10) / 10; }

  var kinds = {
    // 루버(수직 살) 입면: 높이가 사인파로 변함
    louver: function (r) {
      var count = 40, step = W / count, freq = 0.18 + r() * 0.25, phase = r() * 6.28;
      var accent = Math.floor(r() * count), out = '';
      for (var i = 0; i < count; i++) {
        var h = H * (0.2 + 0.7 * (0.5 + 0.5 * Math.sin(i * freq + phase)));
        var attr = i === accent ? ACCENT : 'fill="currentColor" opacity="0.85"';
        out += '<rect x="' + n(i * step + step * 0.2) + '" y="' + n((H - h) / 2) +
          '" width="' + n(step * 0.55) + '" height="' + n(h) + '" ' + attr + '/>';
      }
      return out;
    },

    // 인력점에 가까울수록 커지는 점 격자
    dots: function (r) {
      var cols = 20, rows = 15, cell = W / cols;
      var ax = (0.2 + r() * 0.6) * W, ay = (0.2 + r() * 0.6) * H;
      var dmax = Math.sqrt(W * W + H * H) * 0.55, out = '';
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var cx = x * cell + cell / 2, cy = y * cell + cell / 2;
          var d = Math.sqrt((cx - ax) * (cx - ax) + (cy - ay) * (cy - ay));
          var rad = 1.2 + 8.2 * Math.max(0, 1 - d / dmax);
          out += '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(rad) + '" fill="currentColor" opacity="0.85"/>';
        }
      }
      return out + '<circle cx="' + n(ax) + '" cy="' + n(ay) + '" r="6" ' + ACCENT + '/>';
    },

    // 두 모서리를 잇는 직선들이 만드는 곡선(스트링 아트)
    strings: function (r) {
      var count = 34, out = '', shift = r() * 0.25;
      for (var i = 0; i <= count; i++) {
        var t = i / count;
        out += '<line x1="' + n(t * W * 0.7) + '" y1="0" x2="0" y2="' + n((1 - t) * H * 0.85 + H * shift * 0.4) +
          '" stroke="currentColor" stroke-width="0.9" opacity="0.75"/>';
        out += '<line x1="' + n(W - t * W * 0.7) + '" y1="' + H + '" x2="' + W + '" y2="' + n(H - (1 - t) * H * 0.85 - H * shift * 0.4) +
          '" stroke="currentColor" stroke-width="0.9" opacity="0.75"/>';
      }
      out += '<line x1="0" y1="' + n(H * 0.5) + '" x2="' + W + '" y2="' + n(H * 0.5) + '" ' + ACCENT_STROKE + ' stroke-width="1.6"/>';
      return out;
    },

    // 사분원 타일(트뤼셰 패턴)
    truchet: function (r) {
      var s = 25, cols = W / s, rows = H / s, rad = s / 2, out = '';
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var px = x * s, py = y * s, d;
          if (r() < 0.5) {
            d = 'M' + (px + rad) + ',' + py + ' A' + rad + ',' + rad + ' 0 0 1 ' + px + ',' + (py + rad) +
              ' M' + (px + rad) + ',' + (py + s) + ' A' + rad + ',' + rad + ' 0 0 1 ' + (px + s) + ',' + (py + rad);
          } else {
            d = 'M' + (px + rad) + ',' + py + ' A' + rad + ',' + rad + ' 0 0 0 ' + (px + s) + ',' + (py + rad) +
              ' M' + px + ',' + (py + rad) + ' A' + rad + ',' + rad + ' 0 0 1 ' + (px + rad) + ',' + (py + s);
          }
          var hot = r() < 0.07;
          out += '<path d="' + d + '" fill="none" stroke-width="2.2" ' +
            (hot ? ACCENT_STROKE : 'stroke="currentColor" opacity="0.8"') + '/>';
        }
      }
      return out;
    },
  };
  var names = Object.keys(kinds);

  function render(seed, kind) {
    seed = seed || 1;
    var k = kinds[kind] ? kind : names[seed % names.length];
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" ' +
      'aria-hidden="true" focusable="false">' + kinds[k](rng(seed)) + '</svg>';
  }

  window.Art = { render: render };
})();
