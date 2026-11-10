/* B2B Market front-end prototype. Data comes from assets/js/data.js (built from src/data.json).
   Real: category counts, onboarded companies, contact details. Sample: products, suppliers, requests. */
(function () {
  'use strict';
  var D = window.B2B, PORTAL = 'https://portal.b2bmarket.ca/login';
  var IMG = function (n) { return 'https://www.b2bmarket.ca/images/' + n + '.webp'; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-CA'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ic = function (n, c) { return '<svg class="ic ' + (c || '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var by = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; };
  var cat = function (id) { return by(D.cats, id); }, sup = function (id) { return by(D.suppliers, id); }, prod = function (id) { return by(D.products, id); };
  var param = function (k) { return new URLSearchParams(location.search).get(k); };
  var initials = function (n) { return n.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var page = document.body.dataset.page;

  /* ---------- pricing ---------- */
  function tiers(p) {
    if (p.min == null) return null;
    var mid = Math.round((p.min + p.max) / 2), a = p.moq, b = Math.max(p.moq * 2, p.moq + 1), c = Math.max(p.moq * 5, b + 1);
    return [{ from: a, to: b - 1, price: p.max }, { from: b, to: c - 1, price: mid }, { from: c, to: null, price: p.min }];
  }
  function tierFor(p, q) { var t = tiers(p), i = 0; t.forEach(function (x, k) { if (q >= x.from) i = k; }); return i; }
  function ladder(p, active, large) {
    var t = tiers(p);
    if (!t) return '<div class="onreq"><b>Price on request</b><br>Depends on configuration and quantity.</div>';
    return '<div class="ladder' + (large ? ' ladder-lg' : '') + '" role="group" aria-label="Price by quantity">' + t.map(function (x, i) {
      var q = (x.to == null ? x.from + '+' : x.to === x.from ? x.from : x.from + '–' + x.to) + (large ? ' ' + p.units : '');
      return '<div' + (i === active ? ' class="on"' : '') + '><span class="q">' + q + '</span><span class="p">' + money(x.price) + '</span></div>';
    }).join('') + '</div>';
  }

  /* ---------- cards ---------- */
  var quote = store.get('b2b.quote', []), saved = store.get('b2b.saved', []), compare = [];
  function card(p) {
    var s = sup(p.sup), c = cat(p.cat);
    return '<article class="pcard"><a class="pimg" href="product.html?id=' + p.id + '"><img loading="lazy" src="' + IMG(p.img) + '" alt=""><span class="badge">Sample listing</span></a>' +
      '<button class="save" type="button" data-save="' + p.id + '" aria-pressed="' + (saved.indexOf(p.id) >= 0) + '" aria-label="Save ' + esc(p.name) + '">' + ic('heart') + '</button>' +
      '<div class="pbody"><span class="cat"><a class="muted" href="' + c.slug + '.html">' + c.name + '</a> / ' + p.sub + '</span>' +
      '<h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' + ladder(p, -1) +
      '<div class="pmeta">' + (p.min != null ? '<span>Per <b>' + p.unit + '</b></span>' : '') + '<span>Min. <b>' + p.moq + ' ' + (p.moq === 1 ? p.unit : p.units) + '</b></span><span>Ships in <b>' + p.lead.replace(' business', '') + '</b></span></div>' +
      '<div class="psup">' + ic('leaf', 'ic-s') + '<a href="supplier.html?id=' + s.id + '">' + esc(s.name) + '</a><span class="muted">' + s.city + ', ' + s.prov + '</span></div>' +
      '<div class="pact"><button class="btn btn-line btn-s" type="button" data-quote="' + p.id + '">Add to quote list</button>' +
      '<label class="cmp"><input type="checkbox" data-compare="' + p.id + '"' + (compare.indexOf(p.id) >= 0 ? ' checked' : '') + '>Compare</label></div></div></article>';
  }
  function reqRow(r) {
    var left = D.slots - r.quotes, c = cat(r.cat);
    return '<article class="req panel"><div><div class="row"><a class="badge badge-blue" href="' + c.slug + '.html">' + c.name + '</a><span class="badge">Sample request</span></div>' +
      '<h3>' + esc(r.title) + '</h3><div class="facts"><span>Quantity <b>' + r.qty + '</b></span><span>Deliver to <b>' + r.city + ', ' + r.prov + '</b></span><span>Respond by <b>' + r.due + '</b></span><span>' + r.id + ', posted ' + r.posted.toLowerCase() + '</span></div></div>' +
      '<div class="slots"><b>' + left + ' of ' + D.slots + '</b> quote slots left<div class="meter" role="img" aria-label="' + r.quotes + ' quotes received"><i style="width:' + r.quotes * 10 + '%"></i></div></div>' +
      '<a class="btn btn-sell btn-s" href="' + PORTAL + '">Send a quote</a></article>';
  }
  function supCard(s) {
    var n = D.products.filter(function (p) { return p.sup === s.id; }).length;
    return '<article class="scard panel"><div class="sup-head"><span class="avatar">' + initials(s.name) + '</span><div><strong><a href="supplier.html?id=' + s.id + '">' + esc(s.name) + '</a></strong><span class="small muted">' + s.city + ', ' + D.provs[s.prov] + '</span></div></div>' +
      '<p class="small">' + esc(s.about) + '</p>' +
      '<div class="taglist"><span class="tag">' + s.type + '</span>' + s.cats.map(function (c) { return '<span class="tag">' + cat(c).name + '</span>'; }).join('') + '<span class="tag">Serves ' + s.serves + '</span></div>' +
      '<div class="row" style="justify-content:space-between"><span class="small muted">' + n + (n === 1 ? ' listing' : ' listings') + ' · Sample supplier</span><a class="btn btn-line btn-s" href="supplier.html?id=' + s.id + '">View storefront</a></div></article>';
  }
  function empty(title, text, catId) {
    return '<div class="empty"><h3>' + title + '</h3><p class="muted">' + text + '</p><div class="row"><a class="btn btn-buy btn-s" href="post-request.html' + (catId ? '?cat=' + catId : '') + '">Post a request</a></div></div>';
  }

  /* ---------- understanding a plain-language request ---------- */
  var NOT_QTY = /^(x|×|in|inch|inches|w|kw|lb|lbs|gb|tb|ft|mil|v|ct|mm|cm|gauge|ect|%)$/i;
  function parseNeed(text) {
    var out = { qty: null, noun: '', city: '', prov: '', when: '', cat: null, matches: [] }, t = ' ' + text + ' ', m;
    var re = /(^|[^\w.×-])(\d[\d,]*)(?:\s*([a-zA-Z×%]+))?(?:\s+([a-zA-Z]+))?/g;
    while ((m = re.exec(t))) {
      var word = m[3] || '', n = parseInt(m[2].replace(/,/g, ''), 10);
      var before = t.slice(Math.max(0, m.index - 3), m.index + 1);
      if (NOT_QTY.test(word) || /[x×]\s*$/i.test(before) || /R-$/i.test(before) || n === 0) continue;
      if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(word) || /(by|on|before)\s+\w+\s*$/i.test(t.slice(0, m.index + 1)) && n <= 31) continue;
      // "2,000 shipping boxes": the thing being counted is the plural word, not the adjective before it.
      var second = (m[4] || '').toLowerCase(); word = word.toLowerCase();
      out.qty = n; out.noun = second && /s$/.test(second) && !/s$/.test(word) && !/^(to|for|in|by|at|of|and|with|delivered)$/.test(word) ? second : (/^(to|for|in|by|at|of|and|with|delivered)$/.test(word) ? '' : word); break;
    }
    Object.keys(D.cities).some(function (c) { if (new RegExp('\\b' + c.replace('.', '\\.') + '\\b', 'i').test(text)) { out.city = c; out.prov = D.cities[c]; return true; } });
    m = text.match(/\b(asap|next week|next month|this month|this week|in \d+ (?:days?|weeks?)|by (?:the end of )?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?(?: \d{1,2})?)\b/i);
    if (m) out.when = m[0];
    var words = text.toLowerCase().match(/[a-zà-ÿ]+/g) || [], best = 0;
    D.cats.forEach(function (c) { var s = words.filter(function (w) { return c.words.indexOf(w) >= 0; }).length; if (s > best) { best = s; out.cat = c; } });
    var stop = ['the', 'and', 'for', 'with', 'need', 'want', 'new', 'our', 'delivered', 'delivery', 'next', 'month', 'week', 'units'];
    var keys = words.filter(function (w) { return w.length > 2 && stop.indexOf(w) < 0; });
    out.matches = D.products.map(function (p) {
      var hay = (p.name + ' ' + p.sub + ' ' + p.desc).toLowerCase(), s = 0;
      keys.forEach(function (w) { var stem = w.replace(/(es|s)$/, ''); if (stem.length > 2 && hay.indexOf(stem) >= 0) s += p.name.toLowerCase().indexOf(stem) >= 0 ? 2 : 1; });
      if (out.cat && p.cat === out.cat.id) s += 1;
      return { p: p, s: s };
    }).filter(function (x) { return x.s >= 3; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3).map(function (x) { return x.p; });
    if (!out.cat && out.matches.length) out.cat = cat(out.matches[0].cat);
    return out;
  }
  // Turn "2,000 boxes" into selling units ("8 bundles of 250") and a price range.
  function estimate(p, need) {
    if (!need.qty || p.min == null) return '';
    var stem = need.noun.replace(/(es|s)$/, '');
    if (stem && p.name.toLowerCase().indexOf(stem) < 0 && stem !== p.unit) return '';
    var pack = p.name.match(/\((?:bundle|case|box|unit) of ([\d,]+)\)/i), units = need.qty, note = '';
    if (pack && need.noun && need.noun.replace(/(es|s)$/, '') !== p.unit) { var size = parseInt(pack[1].replace(/,/g, ''), 10); units = Math.ceil(need.qty / size); note = need.qty.toLocaleString('en-CA') + ' ' + need.noun + ' is about ' + units + ' ' + (units === 1 ? p.unit : p.units) + '. '; }
    var t = tiers(p), i = tierFor(p, units);
    return note + (units < p.moq ? 'Below the minimum order of ' + p.moq + ' ' + p.units + '.' : 'Estimate ' + money(units * p.min) + ' to ' + money(units * t[i].price) + ', before tax and delivery.');
  }

  /* ---------- header: category menu, search suggestions, counters ---------- */
  var toastTimer;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3400); }
  function counts() { [['#quoteCount', quote.length], ['#savedCount', saved.length]].forEach(function (x) { var el = $(x[0]); el.textContent = x[1]; el.hidden = !x[1]; }); }
  function chrome() {
    var btn = $('#catBtn'), menu = $('#catMenu');
    var setMenu = function (open) { menu.hidden = !open; btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(menu.hidden); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); $('#suggest').hidden = true; } });

    var q = $('#q'), box = $('#suggest');
    if (param('q')) q.value = param('q');
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase(); if (v.length < 2) { box.hidden = true; return; }
      var hit = function (s) { return s.toLowerCase().indexOf(v) >= 0; };
      var cs = D.cats.filter(function (c) { return hit(c.name) || c.subs.some(hit) || c.words.some(function (w) { return w.indexOf(v) === 0; }); }).slice(0, 3);
      var ps = D.products.filter(function (p) { return hit(p.name) || hit(p.sub); }).slice(0, 5);
      var ss = D.suppliers.filter(function (s) { return hit(s.name) || hit(s.city); }).slice(0, 3);
      var html = '';
      if (cs.length) html += '<h3>Categories</h3>' + cs.map(function (c) { return '<a href="' + c.slug + '.html">' + ic(c.icon, 'ic-s') + c.name + '<span>' + c.products + ' products</span></a>'; }).join('');
      if (ps.length) html += '<h3>Products</h3>' + ps.map(function (p) { return '<a href="product.html?id=' + p.id + '">' + ic('tag', 'ic-s') + esc(p.name) + '<span>' + (p.min != null ? 'from ' + money(p.min) : 'on request') + '</span></a>'; }).join('');
      if (ss.length) html += '<h3>Suppliers</h3>' + ss.map(function (s) { return '<a href="supplier.html?id=' + s.id + '">' + ic('store', 'ic-s') + esc(s.name) + '<span>' + s.city + ', ' + s.prov + '</span></a>'; }).join('');
      html += '<h3>Not finding it?</h3><a href="post-request.html?need=' + encodeURIComponent(q.value.trim()) + '">' + ic('spark', 'ic-s') + 'Ask suppliers to quote “' + esc(q.value.trim()) + '”</a>';
      box.innerHTML = html; box.hidden = false;
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.hidden = true; });
    counts();
  }

  /* ---------- quote list, saved, compare ---------- */
  function addQuote(id) { if (quote.indexOf(id) < 0) { quote.push(id); store.set('b2b.quote', quote); } counts(); toast('Added to your quote list. Send one request for everything on it.'); }
  function drawTray() { $('#tray').hidden = !compare.length; $('#trayItems').innerHTML = compare.map(function (id) { return '<span class="tag">' + esc(prod(id).name) + '</span>'; }).join(''); }
  function openCompare() {
    if (compare.length < 2) { toast('Pick at least two products to compare.'); return; }
    var ps = compare.map(prod), row = function (l, f) { return '<tr><th scope="row">' + l + '</th>' + ps.map(function (p) { return '<td>' + f(p) + '</td>'; }).join('') + '</tr>'; };
    $('#cmpBody').innerHTML = '<table><thead><tr><th></th>' + ps.map(function (p) { return '<th scope="col">' + esc(p.name) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      row('Price at minimum order', function (p) { return p.min == null ? 'On request' : money(p.max) + ' per ' + p.unit; }) +
      row('Best volume price', function (p) { var t = tiers(p); return t ? money(p.min) + ' at ' + t[2].from + '+ ' + p.units : 'On request'; }) +
      row('Minimum order', function (p) { return p.moq + ' ' + (p.moq === 1 ? p.unit : p.units); }) +
      row('Ships in', function (p) { return p.lead; }) +
      row('Supplier', function (p) { var s = sup(p.sup); return esc(s.name) + ', ' + s.city + ', ' + s.prov; }) +
      row('', function (p) { return '<button class="btn btn-buy btn-s" type="button" data-quote="' + p.id + '">Add to quote list</button>'; }) +
      '</tbody></table><p class="note">Sample listings. Prices are indicative until a supplier quotes.</p>';
    $('#cmpDlg').showModal();
  }

  /* ---------- shared blocks ---------- */
  function faqs() { $$('[data-faq]').forEach(function (el) { el.innerHTML = D.faqs.map(function (f) { return '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>'; }).join(''); }); }
  function tabsets() {
    $$('[role=tablist]').forEach(function (bar) {
      bar.addEventListener('click', function (e) { var b = e.target.closest('[role=tab]'); if (!b) return; $$('[role=tab]', bar).forEach(function (t) { t.setAttribute('aria-selected', t === b); $('#' + t.getAttribute('aria-controls')).hidden = t !== b; }); });
    });
  }
  function companies(el, tabsEl, limit) {
    var tally = {}; D.partners.forEach(function (c) { if (c[3]) tally[c[3]] = (tally[c[3]] || 0) + 1; });
    var draw = function (pv) {
      el.innerHTML = D.partners.filter(function (c) { return pv === 'all' || c[3] === pv; }).slice(0, limit || 99).map(function (c) {
        return '<a class="co panel" href="' + c[4] + '" rel="noopener"><span class="logo-box"><span class="mono">' + initials(c[0]) + '</span><img loading="lazy" src="https://www.b2bmarket.ca/images/partners/' + c[1] + '.webp" alt=""></span><span><strong>' + esc(c[0]) + '</strong><span>' + (c[2] ? c[2] + ', ' + c[3] : 'Canada') + '</span></span></a>';
      }).join('');
      if (tabsEl) $$('.tab', tabsEl).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.pv === pv); });
    };
    if (tabsEl) {
      tabsEl.innerHTML = '<button class="tab" type="button" data-pv="all">All ' + D.partners.length + '</button>' + Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).map(function (pv) { return '<button class="tab" type="button" data-pv="' + pv + '">' + D.provs[pv] + ' ' + tally[pv] + '</button>'; }).join('');
      tabsEl.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) draw(b.dataset.pv); });
    }
    draw('all');
  }
  function catStrip(el) {
    el.innerHTML = D.cats.map(function (c) { return '<a href="' + c.slug + '.html"><span class="ph">' + ic(c.icon, 'ic-l') + '<img loading="lazy" src="' + IMG(c.img) + '" alt=""></span><span>' + c.name + '<small>' + c.products + ' products</small></span></a>'; }).join('');
  }
  function needChips(n, dark) {
    var k = dark ? 'pill pill-ok' : 'chip', miss = dark ? 'pill pill-miss' : 'chip chip-miss', h = '';
    if (n.qty) h += '<span class="' + k + '">' + ic('check', 'ic-s') + n.qty.toLocaleString('en-CA') + (n.noun ? ' ' + n.noun : '') + '</span>';
    if (n.city) h += '<span class="' + k + '">' + ic('pin', 'ic-s') + n.city + ', ' + n.prov + '</span>';
    if (n.when) h += '<span class="' + k + '">' + ic('calendar', 'ic-s') + n.when + '</span>';
    if (n.cat) h += '<span class="' + k + '">' + ic(n.cat.icon, 'ic-s') + n.cat.name + '</span>';
    if (!n.qty) h += '<span class="' + miss + '">Add a quantity</span>';
    if (!n.city) h += '<span class="' + miss + '">Add a delivery city</span>';
    return h;
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    catStrip($('#catStrip'));
    $('#readyGrid').innerHTML = ['p1', 'p8', 'p11', 'p9', 'p14', 'p16', 'p12', 'p3'].map(prod).map(card).join('');
    $('#reqPreview').innerHTML = D.requests.slice(0, 3).map(reqRow).join('');
    companies($('#coGrid'), null, 12);
    $('#arts').innerHTML = D.articles.map(function (a) { return '<a href="' + a[1] + '"><span>' + a[2] + '</span>' + esc(a[0]) + ic('arrow', 'ic-s') + '</a>'; }).join('');

    var seg = $('#heroSeg'), panes = { buy: $('#heroBuy'), sell: $('#heroSell') };
    seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', seg).forEach(function (x) { x.setAttribute('aria-selected', x === b); }); panes.buy.hidden = b.dataset.side !== 'buy'; panes.sell.hidden = b.dataset.side !== 'sell'; });
    var need = $('#need'), out = $('#needOut');
    var examples = D.popular.slice(0, 5).map(function (p) { return '<button class="pill" type="button" data-need="' + p + '">' + p + '</button>'; }).join('');
    var draw = function () {
      var v = need.value.trim();
      if (v.length < 3) { out.innerHTML = '<span>Try</span>' + examples; return; }
      var n = parseNeed(v), nSup = n.cat ? D.suppliers.filter(function (s) { return s.cats.indexOf(n.cat.id) >= 0; }).length : 0;
      out.innerHTML = '<span>We understood</span>' + needChips(n, true) + (nSup ? '<span class="pill">' + nSup + ' matching suppliers</span>' : '');
    };
    need.addEventListener('input', draw);
    out.addEventListener('click', function (e) { var b = e.target.closest('[data-need]'); if (b) { need.value = b.dataset.need; need.focus(); draw(); } });
    $('#needForm').addEventListener('submit', function (e) { e.preventDefault(); if (!need.value.trim()) { toast('Describe what you need, for example: 2,000 shipping boxes to Mississauga.'); need.focus(); return; } location.href = 'post-request.html?need=' + encodeURIComponent(need.value.trim()); });
    draw();
    var sc = $('#sellCat'), so = $('#sellOut');
    sc.innerHTML = '<option value="">Choose what you sell</option>' + D.cats.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('');
    var drawSell = function () {
      var n = D.requests.filter(function (r) { return !sc.value || r.cat === sc.value; }).length;
      so.innerHTML = '<span class="pill pill-ok">' + n + (n === 1 ? ' open request' : ' open requests') + (sc.value ? ' in ' + cat(sc.value).name : ' right now') + '</span><span>Each request takes ' + D.slots + ' quotes, so early replies get seen.</span>';
    };
    sc.addEventListener('change', drawSell); drawSell();
    $('#sellForm').addEventListener('submit', function (e) { e.preventDefault(); location.href = 'requests.html' + (sc.value ? '?cat=' + sc.value : ''); });
    var how = $('#howTabs');
    how.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (!b) return; $$('.tab', how).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('#howBuy').hidden = b.dataset.side !== 'buy'; $('#howSell').hidden = b.dataset.side !== 'sell'; });
  };

  pages.categories = function () {
    $('#catCards').innerHTML = D.cats.map(function (c) {
      var n = D.suppliers.filter(function (s) { return s.cats.indexOf(c.id) >= 0; }).length;
      return '<article class="pcard"><a class="pimg" href="' + c.slug + '.html" style="aspect-ratio:16/9"><img loading="lazy" src="' + IMG(c.img) + '" alt=""></a><div class="pbody"><h3 style="font:600 19px var(--display)"><a href="' + c.slug + '.html">' + c.name + '</a></h3><p class="small">' + c.intro + '</p>' +
        '<div class="taglist">' + c.subs.map(function (s) { return '<a class="tag" href="' + c.slug + '.html?sub=' + encodeURIComponent(s) + '" style="text-decoration:none">' + s + '</a>'; }).join('') + '</div>' +
        '<div class="psup"><span><b style="color:var(--ink)">' + c.products + '</b> products</span><span><b style="color:var(--ink)">' + c.vendors + '</b> vendors</span><a class="link" style="margin-left:auto" href="' + c.slug + '.html">Open ' + ic('arrow', 'ic-s') + '</a></div></div></article>';
    }).join('');
  };

  pages.category = function () {
    var c = cat(document.body.dataset.cat), all = D.products.filter(function (p) { return p.cat === c.id; }), sub = param('sub') || 'all';
    var chips = $('#subChips'), grid = $('#catGrid'), sort = $('#catSort');
    var draw = function () {
      var list = all.filter(function (p) { return sub === 'all' || p.sub === sub; });
      if (sort.value === 'low') list.sort(function (a, b) { return (a.min == null ? 1e9 : a.min) - (b.min == null ? 1e9 : b.min); });
      if (sort.value === 'fast') list.sort(function (a, b) { return a.days - b.days; });
      if (sort.value === 'moq') list.sort(function (a, b) { return a.moq - b.moq; });
      grid.innerHTML = list.length ? list.map(card).join('') : empty('No ' + sub.toLowerCase() + ' listings yet', 'Suppliers in ' + c.name + ' are still adding stock. Post a request and they will quote you directly.', c.id);
      $('#catCount').textContent = list.length + (list.length === 1 ? ' listing' : ' listings');
      $$('.tab', chips).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.sub === sub); });
    };
    chips.innerHTML = '<button class="tab" type="button" data-sub="all">All ' + c.name.toLowerCase() + '</button>' + c.subs.map(function (s) { return '<button class="tab" type="button" data-sub="' + s + '">' + s + '</button>'; }).join('');
    chips.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) { sub = b.dataset.sub; draw(); } });
    sort.addEventListener('change', draw); draw();
    var ss = D.suppliers.filter(function (s) { return s.cats.indexOf(c.id) >= 0; });
    $('#catSups').innerHTML = ss.map(supCard).join('');
    var rs = D.requests.filter(function (r) { return r.cat === c.id; });
    $('#catReqs').innerHTML = rs.length ? rs.map(reqRow).join('') : '<div class="empty"><h3>No open requests in ' + c.name + ' today</h3><p class="muted">Register as a supplier and we will send you new requests in this category.</p></div>';
    $('#catNeed').addEventListener('submit', function (e) { e.preventDefault(); location.href = 'post-request.html?cat=' + c.id + '&need=' + encodeURIComponent($('#catNeedText').value.trim()); });
    $('#otherCats').innerHTML = D.cats.filter(function (x) { return x.id !== c.id; }).map(function (x) { return '<a class="tab" href="' + x.slug + '.html">' + x.name + '</a>'; }).join('');
  };

  pages.products = function () {
    var f = $('#filters'), grid = $('#prodGrid'), q = (param('q') || '').trim(), onlySaved = param('saved') === '1';
    var n = function (fn) { return D.products.filter(fn).length; };
    $('#fCat').innerHTML += D.cats.map(function (c) { return '<label><input type="checkbox" name="cat" value="' + c.id + '"' + (param('cat') === c.id ? ' checked' : '') + '>' + c.name + '<span>' + n(function (p) { return p.cat === c.id; }) + '</span></label>'; }).join('');
    var provs = D.suppliers.map(function (s) { return s.prov; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    $('#fProv').innerHTML += provs.map(function (pv) { return '<label><input type="checkbox" name="prov" value="' + pv + '">' + D.provs[pv] + '</label>'; }).join('');
    if (q) $('#prodTitle').textContent = 'Results for “' + q + '”';
    if (onlySaved) $('#prodTitle').textContent = 'Saved products';
    var vals = function (name) { return $$('input[name=' + name + ']:checked', f).map(function (i) { return i.value; }); };
    var draw = function () {
      var cs = vals('cat'), ps = vals('prov'), moq = $('input[name=moq]:checked', f).value, priced = $('#fPriced').checked, sort = $('#prodSort').value;
      var words = q.toLowerCase().split(/\s+/).filter(Boolean);
      var list = D.products.filter(function (p) {
        var s = sup(p.sup), hay = (p.name + ' ' + p.sub + ' ' + cat(p.cat).name + ' ' + s.name + ' ' + p.desc).toLowerCase();
        return (!cs.length || cs.indexOf(p.cat) >= 0) && (!ps.length || ps.indexOf(s.prov) >= 0) && (moq === 'any' || p.moq <= +moq) && (!priced || p.min != null) &&
          (!onlySaved || saved.indexOf(p.id) >= 0) && words.every(function (w) { return hay.indexOf(w.replace(/(es|s)$/, '')) >= 0; });
      });
      if (sort === 'low') list.sort(function (a, b) { return (a.min == null ? 1e9 : a.min) - (b.min == null ? 1e9 : b.min); });
      if (sort === 'high') list.sort(function (a, b) { return (b.max || 0) - (a.max || 0); });
      if (sort === 'fast') list.sort(function (a, b) { return a.days - b.days; });
      if (sort === 'moq') list.sort(function (a, b) { return a.moq - b.moq; });
      $('#prodCount').textContent = list.length + (list.length === 1 ? ' product' : ' products');
      grid.innerHTML = list.length ? list.map(card).join('') : (onlySaved ? '<div class="empty"><h3>Nothing saved yet</h3><p class="muted">Tap the heart on any product to keep it here.</p></div>' : empty('No products match', q ? 'Suppliers may still carry “' + esc(q) + '”. Post a request and let them quote.' : 'Remove a filter, or post a request and let suppliers quote.'));
    };
    f.addEventListener('change', draw); $('#prodSort').addEventListener('change', draw);
    $('#fClear').addEventListener('click', function () { $$('input[type=checkbox]', f).forEach(function (i) { i.checked = false; }); $('input[name=moq][value=any]', f).checked = true; draw(); });
    draw();
  };

  pages.product = function () {
    var p = prod(param('id')) || D.products[0], s = sup(p.sup), c = cat(p.cat), t = tiers(p);
    document.title = p.name + ' | B2B Market';
    $('#crumbCat').textContent = c.name; $('#crumbCat').href = c.slug + '.html'; $('#crumbName').textContent = p.name;
    $('#pImg').src = IMG(p.img); $('#pImg').alt = p.name; $('#pName').textContent = p.name; $('#pDesc').textContent = p.desc;
    $('#pSub').innerHTML = '<a href="' + c.slug + '.html">' + c.name + '</a> / ' + p.sub;
    $('#supName').textContent = s.name; $('#supLoc').textContent = s.city + ', ' + D.provs[s.prov]; $('#supAvatar').textContent = initials(s.name);
    $('#supType').textContent = s.type; $('#supServes').textContent = s.serves; $('#supLink').href = 'supplier.html?id=' + s.id;
    $('#moqLine').textContent = 'Minimum order ' + p.moq + ' ' + (p.moq === 1 ? p.unit : p.units) + '. Ships in ' + p.lead + '.';
    $('#unitLabel').textContent = 'Quantity (' + p.units + ')';
    $('#specRows').innerHTML = p.specs.map(function (x) { return '<tr><th scope="row">' + esc(x[0]) + '</th><td>' + esc(x[1]) + '</td></tr>'; }).join('');
    var qty = $('#qty'); qty.value = p.moq;
    var draw = function () {
      var q = Math.max(1, parseInt(qty.value, 10) || 1);
      if (!t) { $('#ladder').innerHTML = ladder(p); $('#totalBox').hidden = true; $('#nudge').textContent = 'Add it to your quote list and the supplier will price ' + q + ' ' + (q === 1 ? p.unit : p.units) + '.'; return; }
      var i = tierFor(p, q), x = t[i], next = t[i + 1];
      $('#ladder').innerHTML = ladder(p, q >= p.moq ? i : -1, true);
      $('#unitPrice').textContent = money(x.price) + ' per ' + p.unit; $('#lineTotal').textContent = money(x.price * q);
      $('#nudge').textContent = q < p.moq ? 'Below the minimum order of ' + p.moq + '.' : next ? 'Add ' + (next.from - q) + ' more to pay ' + money(next.price) + ' per ' + p.unit + ' and save ' + money((x.price - next.price) * next.from) + '.' : 'You have the best volume price.';
    };
    qty.addEventListener('input', draw);
    $('#qMinus').addEventListener('click', function () { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); draw(); });
    $('#qPlus').addEventListener('click', function () { qty.value = (parseInt(qty.value, 10) || 0) + 1; draw(); });
    draw();
    $('#pAdd').addEventListener('click', function () { addQuote(p.id); });
    $('#pAsk').href = 'post-request.html?cat=' + c.id + '&need=' + encodeURIComponent(p.name);
    var alts = D.products.filter(function (x) { return x.id !== p.id && x.sub === p.sub && x.sup !== p.sup; });
    $('#altBox').hidden = !alts.length;
    $('#altRows').innerHTML = [p].concat(alts).map(function (x) { var z = sup(x.sup); return '<tr><td><a href="product.html?id=' + x.id + '">' + esc(x.name) + '</a>' + (x.id === p.id ? ' <span class="badge badge-blue">This listing</span>' : '') + '</td><td>' + esc(z.name) + ', ' + z.city + ', ' + z.prov + '</td><td>' + (x.min == null ? 'On request' : money(x.min) + ' to ' + money(x.max)) + '</td><td>' + x.moq + ' ' + (x.moq === 1 ? x.unit : x.units) + '</td><td>' + x.lead + '</td></tr>'; }).join('');
    $('#tellList').innerHTML = c.tell.map(function (x) { return '<li>' + ic('check', 'ic-s') + '<span>' + x + '</span></li>'; }).join('');
    var same = D.products.filter(function (x) { return x.id !== p.id && x.cat === p.cat; }), rest = D.products.filter(function (x) { return x.cat !== p.cat; });
    $('#related').innerHTML = same.concat(rest).slice(0, 4).map(card).join('');
    var seen = store.get('b2b.seen', []).filter(function (id) { return id !== p.id; }); seen.unshift(p.id); store.set('b2b.seen', seen.slice(0, 8));
    $$('.opt').forEach(function (g) { g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) $$('button', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
  };

  pages.suppliers = function () {
    var f = $('#supFilters'), grid = $('#supGrid');
    $('#sCat').innerHTML += D.cats.map(function (c) { return '<option value="' + c.id + '"' + (param('cat') === c.id ? ' selected' : '') + '>' + c.name + '</option>'; }).join('');
    var provs = D.suppliers.map(function (s) { return s.prov; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    $('#sProv').innerHTML += provs.map(function (p) { return '<option value="' + p + '">' + D.provs[p] + '</option>'; }).join('');
    var draw = function () {
      var c = $('#sCat').value, pv = $('#sProv').value, q = $('#sQ').value.trim().toLowerCase();
      var list = D.suppliers.filter(function (s) { return (!c || s.cats.indexOf(c) >= 0) && (!pv || s.prov === pv) && (!q || (s.name + ' ' + s.about + ' ' + s.city).toLowerCase().indexOf(q) >= 0); });
      $('#supCount').textContent = list.length + (list.length === 1 ? ' supplier' : ' suppliers');
      grid.innerHTML = list.length ? list.map(supCard).join('') : empty('No suppliers match yet', 'We are still onboarding suppliers in many provinces. Post a request and it reaches suppliers as they join.', c);
    };
    f.addEventListener('input', draw); f.addEventListener('submit', function (e) { e.preventDefault(); }); draw();
  };

  pages.supplier = function () {
    var s = sup(param('id')) || D.suppliers[0], list = D.products.filter(function (p) { return p.sup === s.id; });
    document.title = s.name + ' | B2B Market';
    $$('[data-s=name]').forEach(function (e) { e.textContent = s.name; });
    $('#sAvatar').textContent = initials(s.name); $('#sLine').textContent = s.type + ', ' + s.city + ', ' + D.provs[s.prov]; $('#sAbout').textContent = s.about;
    $('#sFounded').textContent = s.founded; $('#sServes').textContent = s.serves; $('#sListings').textContent = list.length; $('#sType').textContent = s.type;
    $('#sCaps').innerHTML = s.caps.map(function (x) { return '<span class="tag">' + x + '</span>'; }).join('');
    $('#sCats').innerHTML = s.cats.map(function (c) { return '<a class="tag" style="text-decoration:none" href="' + cat(c).slug + '.html">' + cat(c).name + '</a>'; }).join('');
    $('#sGrid').innerHTML = list.length ? list.map(card).join('') : empty('No listings yet', 'Ask ' + esc(s.name) + ' for a quote directly.', s.cats[0]);
    $('#sAsk').href = 'post-request.html?cat=' + s.cats[0] + '&sup=' + s.id;
    var rs = D.requests.filter(function (r) { return s.cats.indexOf(r.cat) >= 0; }).length;
    $('#sReqs').textContent = rs;
  };

  pages.requests = function () {
    var f = $('#filters'), list = $('#reqList'), pre = param('cat') || store.get('b2b.mycat', '');
    $('#fCat').innerHTML += D.cats.map(function (c) { return '<label><input type="checkbox" name="cat" value="' + c.id + '"' + (pre === c.id ? ' checked' : '') + '>' + c.name + '<span>' + D.requests.filter(function (r) { return r.cat === c.id; }).length + '</span></label>'; }).join('');
    var provs = D.requests.map(function (r) { return r.prov; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    $('#fProv').innerHTML += provs.map(function (p) { return '<label><input type="checkbox" name="prov" value="' + p + '">' + D.provs[p] + '</label>'; }).join('');
    var draw = function () {
      var cs = $$('input[name=cat]:checked', f).map(function (i) { return i.value; }), ps = $$('input[name=prov]:checked', f).map(function (i) { return i.value; }), open = $('#fOpen').checked;
      var rows = D.requests.filter(function (r) { return (!cs.length || cs.indexOf(r.cat) >= 0) && (!ps.length || ps.indexOf(r.prov) >= 0) && (!open || D.slots - r.quotes >= 5); });
      if (cs.length === 1) store.set('b2b.mycat', cs[0]);
      $('#reqCount').textContent = rows.length + (rows.length === 1 ? ' open request' : ' open requests');
      list.innerHTML = rows.length ? rows.map(reqRow).join('') : '<div class="empty"><h3>No requests match these filters</h3><p class="muted">Clear a filter, or add more categories to your supplier profile to see more requests.</p></div>';
    };
    f.addEventListener('change', draw); draw();
  };

  pages.post = function () {
    var what = $('#pWhat'), c0 = param('cat'), s0 = param('sup'), filled = {};
    if (param('need')) what.value = param('need');
    $('#pProv').innerHTML += Object.keys(D.provs).map(function (k) { return '<option value="' + k + '">' + D.provs[k] + '</option>'; }).join('');
    $('#pCat').innerHTML += D.cats.map(function (c) { return '<option value="' + c.id + '"' + (c0 === c.id ? ' selected' : '') + '>' + c.name + '</option>'; }).join('');
    if (s0 && sup(s0)) { $('#toSup').hidden = false; $('#toSupName').textContent = sup(s0).name; }
    var drawList = function () {
      $('#qlBox').hidden = !quote.length;
      $('#qList').innerHTML = quote.map(function (id) { var p = prod(id); return '<div class="qitem"><span><b style="color:var(--ink)">' + esc(p.name) + '</b><br><span class="muted">' + sup(p.sup).name + ', min. ' + p.moq + ' ' + p.units + '</span></span><button class="btn btn-ghost btn-s" type="button" data-rm="' + id + '">Remove</button></div>'; }).join('');
    };
    $('#qList').addEventListener('click', function (e) { var b = e.target.closest('[data-rm]'); if (!b) return; quote.splice(quote.indexOf(b.dataset.rm), 1); store.set('b2b.quote', quote); counts(); drawList(); score(); });
    var auto = function (el, v, key) { if (v && (!el.value || filled[key] === el.value)) { el.value = v; filled[key] = v; } };
    var score = function () {
      var checks = [[what.value.trim().length > 12 || quote.length, 'what you need'], [$('#pQty').value.trim(), 'a quantity'], [$('#pCity').value.trim(), 'a delivery city'], [$('#pDate').value, 'a needed-by date'], [$('#pCat').value, 'a category'], [/\d\s*(x|×|in|mm|cm|lb|kw|w|gb)\b/i.test(what.value) || what.value.length > 60, 'a size or specification'], [$('#pBudget').value.trim(), 'a target budget']];
      var done = checks.filter(function (x) { return x[0]; }).length, pct = Math.round(done / checks.length * 100), miss = checks.filter(function (x) { return !x[0]; }).map(function (x) { return x[1]; });
      $('#strBar').style.width = pct + '%'; $('#strPct').textContent = pct + '%';
      $('#strTip').textContent = miss.length ? 'Add ' + miss.slice(0, 2).join(' and ') + ' to get quotes you can compare.' : 'Suppliers have everything they need to quote.';
    };
    var read = function () {
      var v = what.value.trim(), box = $('#insight');
      if (v.length < 3) { box.hidden = true; score(); return; }
      var n = parseNeed(v);
      auto($('#pQty'), n.qty ? n.qty.toLocaleString('en-CA') + (n.noun ? ' ' + n.noun : '') : '', 'qty'); auto($('#pCity'), n.city, 'city');
      if (n.prov && (!$('#pProv').value || filled.prov === $('#pProv').value)) { $('#pProv').value = n.prov; filled.prov = n.prov; }
      if (n.cat && !c0 && (!$('#pCat').value || filled.cat === $('#pCat').value)) { $('#pCat').value = n.cat.id; filled.cat = n.cat.id; }
      var c = cat($('#pCat').value) || n.cat, sups = c ? D.suppliers.filter(function (s) { return s.cats.indexOf(c.id) >= 0; }) : [];
      $('#inChips').innerHTML = needChips(n);
      $('#inSup').textContent = c ? sups.length + (sups.length === 1 ? ' sample supplier in ' : ' sample suppliers in ') + c.name + ' would receive this request.' : 'Pick a category so we can route this to the right suppliers.';
      $('#inMatch').innerHTML = n.matches.map(function (p) { return '<div class="match"><span class="th"><img src="' + IMG(p.img) + '" alt=""></span><span><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a><span class="muted">' + esc(sup(p.sup).name) + '. ' + (estimate(p, n) || (p.min == null ? 'Price on request.' : money(p.min) + ' to ' + money(p.max) + ' per ' + p.unit + '.')) + '</span></span></div>'; }).join('');
      $('#inMatchHead').hidden = !n.matches.length;
      $('#inTell').innerHTML = c ? c.tell.slice(0, 3).map(function (x) { return '<li>' + ic('check', 'ic-s') + '<span>' + x + '</span></li>'; }).join('') : '';
      $('#inTellHead').hidden = !c; if (c) $('#inTellCat').textContent = c.name.toLowerCase();
      box.hidden = false; score();
    };
    what.addEventListener('input', read); $('#postForm').addEventListener('input', score); $('#pCat').addEventListener('change', read);
    $('#postForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      if (!what.value.trim() && !quote.length) bad.push('what you need'); if (!$('#pQty').value.trim()) bad.push('a quantity'); if (!$('#pCity').value.trim()) bad.push('a delivery city'); if (!/^\S+@\S+\.\S+$/.test($('#pEmail').value)) bad.push('a work email');
      if (bad.length) { toast('Add ' + bad.join(', ') + ' to post your request.'); return; }
      $('#postResult').hidden = false; $('#postResult').scrollIntoView({ block: 'center' });
    });
    drawList(); read();
  };

  pages.companies = function () { companies($('#coGrid'), $('#coTabs')); };

  pages.terms = function () {
    var amt = $('#plAmt'), draw = function () {
      var days = +$('input[name=term]:checked').value, d = new Date(); d.setDate(d.getDate() + days);
      var v = Math.max(0, parseFloat(amt.value.replace(/[^\d.]/g, '')) || 0);
      $('#plDate').textContent = d.toLocaleDateString('en-CA', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
      $('#plText').textContent = 'You keep ' + money(v) + ' in your account for ' + days + ' days while the stock is on your shelves.';
    };
    $('#planner').addEventListener('input', draw); draw();
  };

  pages.business = function () {
    $('#approvals').addEventListener('click', function (e) {
      var b = e.target.closest('[data-decide]'); if (!b) return; var yes = b.dataset.decide === 'approve';
      $('.acts', b.closest('.approval')).innerHTML = '<span class="' + (yes ? 'state-ok' : 'state-no') + '">' + (yes ? 'Approved' : 'Declined') + '</span>';
      toast(yes ? 'Approved. The purchase order goes to the supplier.' : 'Declined. The requester is notified.');
    });
  };

  pages.contact = function () {
    $('#contactForm').addEventListener('submit', function (e) { e.preventDefault(); $('#contactResult').hidden = false; $('#contactResult').scrollIntoView({ block: 'center' }); });
  };

  /* ---------- boot ---------- */
  document.addEventListener('error', function (e) { if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; }, true);
  document.addEventListener('DOMContentLoaded', function () {
    chrome(); faqs(); tabsets();
    $$('[data-catstrip]').forEach(catStrip);
    if (pages[page]) pages[page]();
    document.addEventListener('click', function (e) {
      var q = e.target.closest('[data-quote]'); if (q) { addQuote(q.dataset.quote); return; }
      var t = e.target.closest('[data-toast]'); if (t) { toast(t.dataset.toast); return; }
      var s = e.target.closest('[data-save]');
      if (s) { var id = s.dataset.save, i = saved.indexOf(id); if (i >= 0) saved.splice(i, 1); else saved.push(id); store.set('b2b.saved', saved); s.setAttribute('aria-pressed', i < 0); counts(); toast(i < 0 ? 'Saved. Find it under Saved in the header.' : 'Removed from Saved.'); }
    });
    document.addEventListener('change', function (e) {
      var c = e.target.closest('[data-compare]'); if (!c) return; var id = c.dataset.compare, i = compare.indexOf(id);
      if (c.checked && i < 0) { if (compare.length >= 4) { c.checked = false; toast('You can compare up to four products.'); return; } compare.push(id); } else if (!c.checked && i >= 0) compare.splice(i, 1);
      drawTray();
    });
    $('#trayGo').addEventListener('click', openCompare);
    $('#trayClear').addEventListener('click', function () { compare = []; $$('[data-compare]').forEach(function (c) { c.checked = false; }); drawTray(); });
    $('#cmpClose').addEventListener('click', function () { $('#cmpDlg').close(); });
  });
})();
