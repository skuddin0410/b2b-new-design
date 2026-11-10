/* B2B Market front-end prototype.
   Real data (from b2bmarket.ca): CATS counts, COMPANIES, PROVINCE_COUNTS, contact details.
   Sample data: PRODUCTS, SUPPLIERS, REQUESTS, business dashboard. Replace with API calls. */
(function () {
  'use strict';

  var IMG = function (n) { return 'https://www.b2bmarket.ca/images/' + n + '.webp'; };
  var PORTAL = 'https://portal.b2bmarket.ca/login';

  var CATS = [
    { id: 'electronics', name: 'Electronics', img: 1, icon: 'chip', products: '1,200+', vendors: '30+' },
    { id: 'industrial', name: 'Industrial Equipment', img: 2, icon: 'gear', products: '850+', vendors: '51+' },
    { id: 'office', name: 'Office Supplies', img: 3, icon: 'clip', products: '2,500+', vendors: '29+' },
    { id: 'transport', name: 'Transportation', img: 4, icon: 'truck', products: '320+', vendors: '49+' },
    { id: 'building', name: 'Building Materials', img: 5, icon: 'brick', products: '1,800+', vendors: '47+' },
    { id: 'energy', name: 'Energy Solutions', img: 6, icon: 'sun', products: '450+', vendors: '11+' },
    { id: 'retail', name: 'Retail Products', img: 7, icon: 'bag', products: '3,200+', vendors: '40+' },
    { id: 'packaging', name: 'Packaging', img: 8, icon: 'box', products: '1,100+', vendors: '55+' }
  ];

  var PRODUCTS = [
    { id: 'p1', cat: 'packaging', sub: 'Corrugated boxes', name: 'Corrugated Shipping Boxes, 12 x 10 x 8 in (bundle of 250)', lo: 178, hi: 214, unit: 'bundle', moq: 5, lead: 4, sup: 's1', img: 8 },
    { id: 'p2', cat: 'office', sub: 'Paper and printing', name: 'Multipurpose Copy Paper, 8.5 x 11, 5,000 sheets', lo: 41, hi: 52, unit: 'case', moq: 20, lead: 3, sup: 's2', img: 3 },
    { id: 'p3', cat: 'retail', sub: 'Grocery wholesale', name: 'Shelf-Stable Pantry Assortment, Mixed Case (48 ct)', lo: 96, hi: 118, unit: 'case', moq: 10, lead: 5, sup: 's3', img: 7 },
    { id: 'p4', cat: 'packaging', sub: 'Mailers', name: 'Poly Mailers, 10 x 13, Self-Seal (case of 1,000)', lo: 64, hi: 82, unit: 'case', moq: 10, lead: 3, sup: 's1', img: 8 },
    { id: 'p5', cat: 'office', sub: 'Stationery', name: 'Stationery Starter Bundle for 25 Staff', lo: 212, hi: 245, unit: 'bundle', moq: 2, lead: 4, sup: 's2', img: 3 },
    { id: 'p6', cat: 'industrial', sub: 'Safety equipment', name: 'Vented Hard Hats (box of 20)', lo: 148, hi: 176, unit: 'box', moq: 10, lead: 6, sup: 's4', img: 2 },
    { id: 'p7', cat: 'packaging', sub: 'Labels', name: 'Thermal Shipping Labels, 4 x 6 (24 rolls)', lo: 88, hi: 109, unit: 'carton', moq: 5, lead: 2, sup: 's1', img: 8 },
    { id: 'p8', cat: 'electronics', sub: 'Laptops and computers', name: '15.6 in Business Laptop, Core i5, 16GB / 512GB', lo: 689, hi: 749, unit: 'unit', moq: 10, lead: 7, sup: 's5', img: 1 }
  ];

  var SUPPLIERS = {
    s1: { name: 'PackagePro', city: 'Mississauga', prov: 'ON' },
    s2: { name: 'Office Essentials', city: 'Laval', prov: 'QC' },
    s3: { name: 'Maple Provisions', city: 'Toronto', prov: 'ON' },
    s4: { name: 'SafeSite Supply', city: 'Hamilton', prov: 'ON' },
    s5: { name: 'TechSupply Canada', city: 'Markham', prov: 'ON' }
  };

  // Companies listed as onboarded on b2bmarket.ca
  var COMPANIES = [
    ['Just Vertical', 'Toronto', 'ON', 'https://justvertical.com/'],
    ['Mosa Technologies', '', '', 'https://wearemosa.com/'],
    ['PawzNDogz', 'Acton', 'ON', 'https://pawzndogz.ca/'],
    ['WG Corporate', 'Brampton', 'ON', 'http://wgcorporate.com/'],
    ['Quagga Designs', 'St. Catharines', 'ON', 'https://www.quaggadesigns.com/'],
    ['Numove Group', 'Montreal', 'QC', 'https://numovegroup.com/'],
    ['Voltsafe', 'Vancouver', 'BC', 'http://www.voltsafe.com/'],
    ['Inkas', 'Toronto', 'ON', 'http://www.inkas.ca/'],
    ['FortisBC', 'Surrey', 'BC', 'https://www.fortisbc.com/'],
    ['BRC Group', 'Georgetown', 'ON', 'http://www.brc.group/'],
    ['Sleepwell Bedding', 'Winnipeg', 'MB', 'https://www.sleepwellbedding.ca/'],
    ['Vistaprint', '', '', 'http://www.vistaprint.com/'],
    ['Fern Kids', 'Mapleton', 'ON', 'https://www.fernkids.com/'],
    ['Eurocraft', 'Winnipeg', 'MB', 'https://www.eurocraft.mb.ca/'],
    ['Streamline Control', 'Calgary', 'AB', 'https://www.streamlinecontrol.com/'],
    ['Accusteel', 'Acheson', 'AB', 'https://www.accusteel.ca/'],
    ['Nordstark Inc.', 'Calgary', 'AB', 'https://nordstarkinc.com/'],
    ['Reliable Industrial Supply', 'Greater Sudbury', 'ON', 'https://www.reliableclean.ca/'],
    ['VyBuild', 'Charlottetown', 'PE', 'https://vybuild.ca/'],
    ['Novermont Trading', '', '', 'https://novermonttrading.com/'],
    ['Safety Alliance of BC', 'Chilliwack', 'BC', 'http://safetyalliancebc.ca/']
  ];
  var PROV_NAMES = { ON: 'Ontario', BC: 'British Columbia', AB: 'Alberta', MB: 'Manitoba', QC: 'Quebec', PE: 'Prince Edward Island', NS: 'Nova Scotia', SK: 'Saskatchewan' };

  var REQUESTS = [
    { id: 'RFQ-2041', title: 'Corrugated shipping boxes, 12 x 10 x 8 in', cat: 'packaging', qty: '2,000 boxes', city: 'Mississauga', prov: 'ON', due: 'Nov 18', quotes: 6, posted: '2 hours ago' },
    { id: 'RFQ-2040', title: 'Rooftop solar panels, 400 W, with mounting hardware', cat: 'energy', qty: '120 panels', city: 'Calgary', prov: 'AB', due: 'Nov 24', quotes: 3, posted: '5 hours ago' },
    { id: 'RFQ-2038', title: 'Business laptops, 16GB RAM, for a new office', cat: 'electronics', qty: '45 units', city: 'Vancouver', prov: 'BC', due: 'Nov 20', quotes: 8, posted: 'Yesterday' },
    { id: 'RFQ-2035', title: 'Vented hard hats and high-visibility vests', cat: 'industrial', qty: '300 sets', city: 'Greater Sudbury', prov: 'ON', due: 'Nov 21', quotes: 2, posted: 'Yesterday' },
    { id: 'RFQ-2033', title: 'Ergonomic office chairs, mesh back', cat: 'office', qty: '80 chairs', city: 'Montreal', prov: 'QC', due: 'Nov 27', quotes: 5, posted: '2 days ago' },
    { id: 'RFQ-2030', title: 'Mineral wool insulation batts, R-22', cat: 'building', qty: '60 pallets', city: 'Winnipeg', prov: 'MB', due: 'Dec 2', quotes: 1, posted: '2 days ago' },
    { id: 'RFQ-2027', title: 'Electric pallet jacks, 4,500 lb capacity', cat: 'transport', qty: '6 units', city: 'Halifax', prov: 'NS', due: 'Nov 29', quotes: 4, posted: '3 days ago' }
  ];
  var QUOTE_SLOTS = 10;

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + Number(n).toLocaleString('en-CA', { maximumFractionDigits: 0 }); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ic = function (n, cls) { return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var cat = function (id) { return CATS.filter(function (c) { return c.id === id; })[0]; };
  var product = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };
  var plural = function (u, n) { return n === 1 ? u : (u === 'box' ? 'boxes' : u + 's'); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  // Quantity breaks: list price at the minimum order, falling to the low end of the range at 5x.
  function tiers(p) {
    var mid = Math.round((p.lo + p.hi) / 2);
    return [
      { from: p.moq, to: p.moq * 2 - 1, price: p.hi },
      { from: p.moq * 2, to: p.moq * 5 - 1, price: mid },
      { from: p.moq * 5, to: null, price: p.lo }
    ];
  }
  function tierFor(p, qty) {
    var t = tiers(p), i = 0;
    for (var k = 0; k < t.length; k++) { if (qty >= t[k].from) i = k; }
    return i;
  }
  function ladder(p, active, large) {
    return '<div class="ladder' + (large ? ' ladder-lg' : '') + '" role="group" aria-label="Price by quantity">' + tiers(p).map(function (t, i) {
      var q = (t.to ? t.from + '–' + t.to : t.from + '+') + (large ? ' ' + plural(p.unit, 2) : '');
      return '<div' + (i === active ? ' class="on"' : '') + '><span class="q">' + q + '</span><span class="p">' + money(t.price) + '</span></div>';
    }).join('') + '</div>';
  }

  /* ---------- shared chrome ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2.2 2.2L15 10.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>',
    headset: '<path d="M5 14v-2a7 7 0 0 1 14 0v2"/><rect x="3.5" y="13" width="4" height="6" rx="1.5"/><rect x="16.5" y="13" width="4" height="6" rx="1.5"/>',
    leaf: '<path d="M12 3l2 4 3-1-1 4 3 1-4 3 1 3-4-1v4-4l-4 1 1-3-4-3 3-1-1-4 3 1z"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    gear: '<path d="M3 20V10l6 4v-4l6 4V5h4v15z"/><path d="M7 17h2M12 17h2"/>',
    clip: '<path d="M8 12.5 14.5 6a3 3 0 0 1 4.2 4.2l-8 8a4.5 4.5 0 0 1-6.4-6.4L11 5"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    brick: '<path d="M3 6h18v12H3zM3 12h18M9 6v6M15 12v6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5M16 5.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.8.7 3 2.5 3.5 5.2"/>',
    flow: '<rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="15" width="7" height="5" rx="1"/><path d="M6.5 9v4.5a2 2 0 0 0 2 2H14"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-7"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5"/>',
    percent: '<path d="M6 18 18 6"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>'
  };

  function sprite() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">';
    Object.keys(ICONS).forEach(function (k) { s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    return s + '</svg>';
  }

  function header() {
    var page = document.body.dataset.page || '';
    var cur = function (p) { return p === page ? ' aria-current="page"' : ''; };
    return sprite() +
      '<a class="sr" href="#main">Skip to content</a>' +
      '<div class="util"><div class="wrap"><span>Delivering across Canada. Prices in CAD.</span>' +
      '<div class="util-links"><a href="supplier.html">Sell on B2B Market</a><a href="https://www.b2bmarket.ca/help/">Help</a><a href="https://www.b2bmarket.ca/contact/">Contact</a><a href="https://canadiansme.ca/">Backed by CanadianSME</a></div></div></div>' +
      '<header class="site-head"><div class="wrap head-main">' +
      '<a class="logo" href="index.html" aria-label="B2B Market home"><img src="assets/img/logo.png" alt="B2B Market, Simplifying B2B Trade" width="182" height="44"></a>' +
      '<form class="search" role="search" action="index.html#ready">' +
      '<label class="sr" for="scope">Search in</label><select id="scope"><option>Products</option><option>Suppliers</option><option>Buying requests</option></select>' +
      '<label class="sr" for="q">Search</label><input id="q" type="search" placeholder="Search products, suppliers or requests">' +
      '<button class="icon-btn" type="button" data-toast="Search by photo is a planned feature. Upload a product photo to find matching listings." aria-label="Search by photo">' + ic('camera') + '</button>' +
      '<button class="go" type="submit">' + ic('search') + '<span>Search</span></button></form>' +
      '<div class="head-actions">' +
      '<a class="act" href="' + PORTAL + '">' + ic('user') + '<span class="l">Sign in</span></a>' +
      '<a class="act" href="business.html">' + ic('chat') + '<span class="l">Messages</span></a>' +
      '<a class="act" href="index.html#ready">' + ic('heart') + '<span class="l">Saved</span><span class="count" id="savedCount" hidden>0</span></a>' +
      '<a class="act" href="requests.html#post">' + ic('list') + '<span class="l">Quote list</span><span class="count" id="quoteCount" hidden>0</span></a>' +
      '<a class="btn btn-primary" href="requests.html#post">Post a request</a></div></div>' +
      '<nav class="nav" aria-label="Main"><div class="wrap">' +
      '<a href="index.html#categories">' + ic('list', 'ic-s') + 'All categories</a>' +
      '<a href="index.html#ready"' + cur('home') + '>Ready to ship</a>' +
      '<a href="supplier.html"' + cur('supplier') + '>Verified suppliers</a>' +
      '<a href="requests.html"' + cur('requests') + '>Buying requests</a>' +
      '<a href="business.html"' + cur('business') + '>Business accounts</a>' +
      '<a href="index.html#protection">Order Protection <span class="soon">Soon</span></a>' +
      '<a href="index.html#terms">Net terms <span class="soon">Soon</span></a>' +
      '<a href="index.html#companies">Made in Canada</a>' +
      '</div></nav></header>';
  }

  function footer() {
    return '<footer class="foot"><div class="wrap"><div class="foot-grid">' +
      '<div><img src="assets/img/logo-white.png" alt="B2B Market" width="182" height="44"><p>Connecting Canadian buyers and suppliers in one marketplace.</p>' +
      '<p style="margin-top:12px">6345 Dixie Rd, Unit 202<br>Mississauga, ON L5T 1M9</p><a href="mailto:info@b2bmarket.ca">info@b2bmarket.ca</a><a href="tel:+14377784446">+1 437 778 4446</a><p class="tiny">Monday to Friday, 9 a.m. to 6 p.m. ET</p></div>' +
      '<div><h2>Buy</h2><a href="index.html#categories">Browse categories</a><a href="index.html#ready">Ready to ship</a><a href="requests.html#post">Post a request</a><a href="business.html">Business accounts</a><a href="https://www.b2bmarket.ca/buyer-hub/">Buyer Hub</a></div>' +
      '<div><h2>Sell</h2><a href="https://www.b2bmarket.ca/register/">Register as a supplier</a><a href="requests.html">Open buying requests</a><a href="supplier.html">Storefront example</a><a href="https://www.b2bmarket.ca/vendor-hub/">Vendor Hub</a></div>' +
      '<div><h2>Trust</h2><a href="index.html#protection">Order Protection</a><a href="supplier.html#verification">How verification works</a><a href="https://www.b2bmarket.ca/security/">Security</a><a href="https://www.b2bmarket.ca/privacy-policy/">Privacy Policy</a><a href="https://www.b2bmarket.ca/terms-of-service/">Terms of Service</a></div>' +
      '<div><h2>Company</h2><a href="https://www.b2bmarket.ca/about/">About us</a><a href="https://www.b2bmarket.ca/how-it-works/">How it works</a><a href="https://www.b2bmarket.ca/help/">Help Centre</a><a href="https://www.linkedin.com/company/b2b-market-built-to-strengthen-b2b-trade">LinkedIn</a><a href="https://canadiansme.ca/">CanadianSME Magazine</a></div>' +
      '</div><div class="foot-base"><span>© ' + new Date().getFullYear() + ' B2B Market. Built for Canadian businesses.</span><span>Design prototype. Product, supplier and request rows are sample data.</span></div></div></footer>' +
      '<div class="tray" id="tray" hidden><div class="wrap"><strong>Compare</strong><div class="items" id="trayItems"></div><button class="btn btn-quiet btn-s" id="trayClear" type="button">Clear</button><button class="btn btn-primary btn-s" id="trayGo" type="button">Compare products</button></div></div>' +
      '<div class="toast" id="toast" role="status" hidden></div>' +
      '<dialog id="cmpDlg" aria-labelledby="cmpTitle"><div class="dlg-head"><h2 id="cmpTitle" style="font-size:20px">Compare products</h2><button class="btn btn-quiet btn-s" type="button" id="cmpClose">Close</button></div><div class="dlg-body" id="cmpBody"></div></dialog>';
  }

  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------- quote list, saved, compare ---------- */
  var quote = store.get('b2b.quote', []);
  var saved = store.get('b2b.saved', []);
  var compare = [];

  function counts() {
    [['#quoteCount', quote.length], ['#savedCount', saved.length]].forEach(function (x) {
      var el = $(x[0]); if (!el) return; el.textContent = x[1]; el.hidden = !x[1];
    });
  }
  function addQuote(id) {
    if (quote.indexOf(id) < 0) { quote.push(id); store.set('b2b.quote', quote); }
    counts(); toast('Added to your quote list. Send one request for everything on it.');
  }
  function drawTray() {
    var tray = $('#tray'); if (!tray) return;
    tray.hidden = !compare.length;
    $('#trayItems').innerHTML = compare.map(function (id) { return '<span class="pill">' + esc(product(id).name) + '</span>'; }).join('');
  }
  function openCompare() {
    if (compare.length < 2) { toast('Pick at least two products to compare.'); return; }
    var ps = compare.map(product);
    var row = function (label, fn) { return '<tr><th scope="row">' + label + '</th>' + ps.map(function (p) { return '<td>' + fn(p) + '</td>'; }).join('') + '</tr>'; };
    $('#cmpBody').innerHTML = '<table><thead><tr><th></th>' + ps.map(function (p) { return '<th scope="col">' + esc(p.name) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      row('Price at minimum order', function (p) { return money(p.hi) + ' per ' + p.unit; }) +
      row('Best volume price', function (p) { return money(p.lo) + ' at ' + p.moq * 5 + '+ ' + plural(p.unit, 2); }) +
      row('Minimum order', function (p) { return p.moq + ' ' + plural(p.unit, p.moq); }) +
      row('Ships in', function (p) { return p.lead + ' business days'; }) +
      row('Supplier', function (p) { var s = SUPPLIERS[p.sup]; return esc(s.name) + ', ' + s.city + ', ' + s.prov; }) +
      row('', function (p) { return '<button class="btn btn-primary btn-s" type="button" data-quote="' + p.id + '">Add to quote list</button>'; }) +
      '</tbody></table><p class="note">Sample listings. Prices are indicative until a supplier quotes.</p>';
    $('#cmpDlg').showModal();
  }

  function card(p) {
    var s = SUPPLIERS[p.sup], c = cat(p.cat), isSaved = saved.indexOf(p.id) >= 0;
    return '<article class="pcard">' +
      '<a class="pimg" href="product.html?id=' + p.id + '"><img loading="lazy" src="' + IMG(p.img) + '" alt="' + esc(p.name) + '"><span class="badge badge-sample">Sample listing</span></a>' +
      '<button class="save" type="button" data-save="' + p.id + '" aria-pressed="' + isSaved + '" aria-label="Save ' + esc(p.name) + '">' + ic('heart') + '</button>' +
      '<div class="pbody"><span class="cat">' + c.name + ' / ' + p.sub + '</span>' +
      '<h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' + ladder(p, -1) +
      '<div class="pmeta"><span>Price per <b>' + p.unit + '</b></span><span>Min. order <b>' + p.moq + ' ' + plural(p.unit, p.moq) + '</b></span><span>Ships in <b>' + p.lead + ' days</b></span></div>' +
      '<div class="psup">' + ic('leaf', 'ic-s') + '<a href="supplier.html">' + esc(s.name) + '</a><span class="muted">' + s.city + ', ' + s.prov + '</span></div>' +
      '<div class="pact"><button class="btn btn-line btn-s" type="button" data-quote="' + p.id + '">Add to quote list</button>' +
      '<label class="cmp"><input type="checkbox" data-compare="' + p.id + '"' + (compare.indexOf(p.id) >= 0 ? ' checked' : '') + '>Compare</label></div></div></article>';
  }

  /* ---------- page renderers ---------- */
  function home() {
    var rail = $('#rail');
    if (rail) rail.innerHTML = '<h2>Categories</h2>' + CATS.map(function (c) { return '<a href="#categories">' + ic(c.icon) + '<span>' + c.name + '</span><span>' + c.products + '</span></a>'; }).join('') + '<a class="rail-foot" href="requests.html#post"><b>Not listed here?</b>Post a request and suppliers come to you.</a>';

    var live = $('#liveList');
    if (live) live.innerHTML = REQUESTS.slice(0, 3).map(function (r) { return '<li><strong>' + esc(r.title) + '</strong>' + r.qty + ' to ' + r.city + ', ' + r.prov + '</li>'; }).join('');

    var grid = $('#readyGrid'), tabs = $('#readyTabs');
    if (grid && tabs) {
      var used = CATS.filter(function (c) { return PRODUCTS.some(function (p) { return p.cat === c.id; }); });
      var draw = function (id) {
        grid.innerHTML = PRODUCTS.filter(function (p) { return id === 'all' || p.cat === id; }).map(card).join('');
        $$('.tab', tabs).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === id); });
      };
      tabs.innerHTML = '<button class="tab" type="button" data-cat="all">All</button>' + used.map(function (c) { return '<button class="tab" type="button" data-cat="' + c.id + '">' + c.name + '</button>'; }).join('');
      tabs.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) draw(b.dataset.cat); });
      draw('all');
    }

    var cats = $('#catGrid');
    if (cats) cats.innerHTML = CATS.map(function (c) {
      return '<a class="cat-tile" href="#ready"><img loading="lazy" src="' + IMG(c.img) + '" alt=""><div class="t"><h3>' + c.name + '</h3><span>' + c.products + ' products from ' + c.vendors + ' vendors</span></div></a>';
    }).join('');

    var rank = function (el, list, fn) {
      if (!$(el)) return;
      $(el).innerHTML = list.slice(0, 4).map(function (p) { return '<li><img loading="lazy" src="' + IMG(p.img) + '" alt=""><div><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a><span class="muted tiny">' + fn(p) + '</span></div></li>'; }).join('');
    };
    var by = function (f) { return PRODUCTS.slice().sort(function (a, b) { return f(a) - f(b); }); };
    rank('#rankMoq', by(function (p) { return p.moq * p.hi; }), function (p) { return 'First order from ' + money(p.moq * p.hi); });
    rank('#rankLead', by(function (p) { return p.lead; }), function (p) { return 'Ships in ' + p.lead + ' business days'; });
    rank('#rankSave', by(function (p) { return -(p.hi - p.lo) / p.hi; }), function (p) { return 'Save ' + Math.round((p.hi - p.lo) / p.hi * 100) + '% at ' + p.moq * 5 + '+ ' + plural(p.unit, 2); });

    var rp = $('#reqPreview');
    if (rp) rp.innerHTML = REQUESTS.slice(0, 3).map(reqRow).join('');

    var cg = $('#coGrid'), ct = $('#coTabs');
    if (cg && ct) {
      var tally = {};
      COMPANIES.forEach(function (c) { if (c[2]) tally[c[2]] = (tally[c[2]] || 0) + 1; });
      var provs = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; });
      var drawCo = function (pv) {
        cg.innerHTML = COMPANIES.filter(function (c) { return pv === 'all' || c[2] === pv; }).map(function (c) {
          var mono = c[0].split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
          return '<a class="co panel" href="' + c[3] + '" rel="noopener"><span class="mono">' + mono + '</span><span><strong>' + esc(c[0]) + '</strong><span>' + (c[1] ? c[1] + ', ' + c[2] : 'Canada') + '</span></span></a>';
        }).join('');
        $$('.tab', ct).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.pv === pv); });
      };
      ct.innerHTML = '<button class="tab" type="button" data-pv="all">All ' + COMPANIES.length + '</button>' + provs.map(function (pv) { return '<button class="tab" type="button" data-pv="' + pv + '">' + PROV_NAMES[pv] + ' ' + tally[pv] + '</button>'; }).join('');
      ct.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) drawCo(b.dataset.pv); });
      drawCo('all');
    }

    var ask = $('#askForm');
    if (ask) ask.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#askText').value.trim();
      if (!v) { toast('Describe what you need, for example: 2,000 shipping boxes.'); $('#askText').focus(); return; }
      store.set('b2b.draft', { what: v, qty: $('#askQty').value, city: $('#askCity').value });
      location.href = 'requests.html#post';
    });
    $$('[data-fill]').forEach(function (b) { b.addEventListener('click', function () { $('#askText').value = b.dataset.fill; $('#askText').focus(); }); });
  }

  function reqRow(r) {
    var left = QUOTE_SLOTS - r.quotes, c = cat(r.cat);
    return '<article class="req panel"><div><div class="badge-row"><span class="badge badge-blue">' + c.name + '</span><span class="badge badge-sample">Sample request</span></div>' +
      '<h3 style="margin-top:8px">' + esc(r.title) + '</h3><div class="facts"><span>Quantity <b>' + r.qty + '</b></span><span>Deliver to <b>' + r.city + ', ' + r.prov + '</b></span><span>Respond by <b>' + r.due + '</b></span><span>' + r.id + ', posted ' + r.posted + '</span></div></div>' +
      '<div class="slots"><b>' + left + ' of ' + QUOTE_SLOTS + '</b> quote slots left<div class="meter" role="img" aria-label="' + r.quotes + ' quotes received"><i style="width:' + r.quotes * 10 + '%"></i></div></div>' +
      '<a class="btn btn-primary btn-s" href="' + PORTAL + '">Quote now</a></article>';
  }

  function requests() {
    var list = $('#reqList'); if (!list) return;
    var catBox = $('#fCats'), provBox = $('#fProvs');
    catBox.innerHTML += CATS.map(function (c) { return '<label><input type="checkbox" name="cat" value="' + c.id + '">' + c.name + '</label>'; }).join('');
    var provs = REQUESTS.map(function (r) { return r.prov; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    provBox.innerHTML += provs.map(function (p) { return '<label><input type="checkbox" name="prov" value="' + p + '">' + PROV_NAMES[p] + '</label>'; }).join('');
    var draw = function () {
      var cs = $$('input[name=cat]:checked').map(function (i) { return i.value; });
      var ps = $$('input[name=prov]:checked').map(function (i) { return i.value; });
      var open = $('#fOpen').checked;
      var rows = REQUESTS.filter(function (r) { return (!cs.length || cs.indexOf(r.cat) >= 0) && (!ps.length || ps.indexOf(r.prov) >= 0) && (!open || QUOTE_SLOTS - r.quotes >= 5); });
      $('#reqCount').textContent = rows.length + (rows.length === 1 ? ' open request' : ' open requests');
      list.innerHTML = rows.length ? rows.map(reqRow).join('') : '<div class="empty"><h3>No requests match these filters</h3><p class="muted">Clear a filter, or add more categories to your supplier profile to see more requests.</p></div>';
    };
    $('#filters').addEventListener('change', draw); draw();

    var d = store.get('b2b.draft', null);
    if (d) { $('#pWhat').value = d.what || ''; $('#pQty').value = d.qty || ''; $('#pCity').value = d.city || ''; }
    $('#postForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!$('#pWhat').value.trim() || !$('#pQty').value.trim() || !$('#pCity').value.trim()) { toast('Add what you need, a quantity and a delivery city.'); return; }
      $('#postResult').hidden = false; $('#postResult').focus();
    });
  }

  function pdp() {
    var root = $('#pdp'); if (!root) return;
    var id = new URLSearchParams(location.search).get('id');
    var p = product(id) || PRODUCTS[0], s = SUPPLIERS[p.sup], c = cat(p.cat);
    document.title = p.name + ' | B2B Market';
    $('#crumbCat').textContent = c.name; $('#crumbName').textContent = p.name;
    $('#pImg').src = IMG(p.img); $('#pImg').alt = p.name;
    $('#pName').textContent = p.name; $('#pSub').textContent = c.name + ' / ' + p.sub;
    $$('[data-sup-name]').forEach(function (el) { el.textContent = s.name; });
    $$('[data-sup-loc]').forEach(function (el) { el.textContent = s.city + ', ' + s.prov; });
    $('#supAvatar').textContent = s.name.slice(0, 2).toUpperCase();
    $('#sampleLine').textContent = 'Order 1 ' + p.unit + ' at ' + money(p.hi) + ' to check quality before a full order.';
    $('#moqLine').textContent = 'Minimum order ' + p.moq + ' ' + plural(p.unit, p.moq) + '.';
    $('#unitLabel').textContent = 'Quantity (' + plural(p.unit, 2) + ')';
    var qty = $('#qty'); qty.value = p.moq; qty.min = 1;
    var draw = function () {
      var q = Math.max(1, parseInt(qty.value, 10) || 1), i = tierFor(p, q), t = tiers(p)[i];
      $('#ladder').innerHTML = ladder(p, q >= p.moq ? i : -1, true);
      $('#unitPrice').textContent = money(t.price) + ' per ' + p.unit;
      $('#lineTotal').textContent = money(t.price * q);
      var next = tiers(p)[i + 1];
      $('#nudge').textContent = q < p.moq ? 'Below the minimum order of ' + p.moq + '. You can still order a sample.' : next ? 'Add ' + (next.from - q) + ' more to pay ' + money(next.price) + ' per ' + p.unit + '.' : 'You have the best volume price.';
    };
    qty.addEventListener('input', draw);
    $('#qMinus').addEventListener('click', function () { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); draw(); });
    $('#qPlus').addEventListener('click', function () { qty.value = (parseInt(qty.value, 10) || 0) + 1; draw(); });
    draw();
    $('#leadRows').innerHTML = tiers(p).map(function (t, i) { return '<tr><td>' + (t.to ? t.from + ' to ' + t.to : t.from + ' or more') + ' ' + plural(p.unit, 2) + '</td><td>' + (p.lead + i * 3) + ' business days</td></tr>'; }).join('');
    $('#pAdd').addEventListener('click', function () { addQuote(p.id); });
    $$('.opt').forEach(function (g) { g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
    var others = PRODUCTS.filter(function (x) { return x.id !== p.id; });
    var same = others.filter(function (x) { return x.cat === p.cat; });
    $('#related').innerHTML = same.concat(others.filter(function (x) { return x.cat !== p.cat; })).slice(0, 4).map(card).join('');
    tabset('#pTabs');
  }

  function tabset(sel) {
    var bar = $(sel); if (!bar) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[role=tab]'); if (!b) return;
      $$('[role=tab]', bar).forEach(function (t) { t.setAttribute('aria-selected', t === b); $('#' + t.getAttribute('aria-controls')).hidden = t !== b; });
    });
  }

  function supplierPage() {
    var g = $('#storeGrid'); if (!g) return;
    g.innerHTML = PRODUCTS.filter(function (p) { return p.sup === 's1'; }).map(card).join('');
  }

  function business() {
    var box = $('#approvals'); if (!box) return;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-decide]'); if (!b) return;
      var row = b.closest('.approval'), yes = b.dataset.decide === 'approve';
      $('.acts', row).innerHTML = '<span class="' + (yes ? 'state-ok' : 'state-no') + '">' + (yes ? 'Approved' : 'Declined') + '</span>';
      toast(yes ? 'Approved. The purchase order goes to the supplier.' : 'Declined. The requester is notified.');
    });
  }

  /* ---------- boot ---------- */
  // Hide a photo that fails to load so the tinted tile shows instead of a broken icon.
  document.addEventListener('error', function (e) { if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; }, true);

  document.addEventListener('DOMContentLoaded', function () {
    var h = $('#site-header'), f = $('#site-footer');
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();
    counts();
    home(); requests(); pdp(); supplierPage(); business();

    document.addEventListener('click', function (e) {
      var q = e.target.closest('[data-quote]'); if (q) { addQuote(q.dataset.quote); return; }
      var t = e.target.closest('[data-toast]'); if (t) { toast(t.dataset.toast); return; }
      var s = e.target.closest('[data-save]');
      if (s) {
        var id = s.dataset.save, i = saved.indexOf(id);
        if (i >= 0) saved.splice(i, 1); else saved.push(id);
        store.set('b2b.saved', saved); s.setAttribute('aria-pressed', i < 0); counts();
        toast(i < 0 ? 'Saved to your list.' : 'Removed from your list.');
      }
    });
    document.addEventListener('change', function (e) {
      var c = e.target.closest('[data-compare]'); if (!c) return;
      var id = c.dataset.compare, i = compare.indexOf(id);
      if (c.checked && i < 0) {
        if (compare.length >= 4) { c.checked = false; toast('You can compare up to four products.'); return; }
        compare.push(id);
      } else if (!c.checked && i >= 0) compare.splice(i, 1);
      drawTray();
    });
    $('#trayGo').addEventListener('click', openCompare);
    $('#trayClear').addEventListener('click', function () { compare = []; $$('[data-compare]').forEach(function (c) { c.checked = false; }); drawTray(); });
    $('#cmpClose').addEventListener('click', function () { $('#cmpDlg').close(); });
  });
})();
