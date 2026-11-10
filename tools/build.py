#!/usr/bin/env python3
"""Builds the static pages. Run from the repository root: python3 tools/build.py
   Source: src/data.json, src/pages/*.html (page bodies), src/category.html (one template, eight pages)."""
import json, pathlib, re, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'src/data.json').read_text(encoding='utf-8'))
PORTAL = 'https://portal.b2bmarket.ca/login'
REGISTER = 'https://www.b2bmarket.ca/register/'

ICONS = {
 'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 'heart': '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 'list': '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 'check': '<path d="m5 12.5 4.5 4.5L19 7"/>',
 'shield': '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2.2 2.2L15 10.5"/>',
 'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 'calendar': '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>',
 'headset': '<path d="M5 14v-2a7 7 0 0 1 14 0v2"/><rect x="3.5" y="13" width="4" height="6" rx="1.5"/><rect x="16.5" y="13" width="4" height="6" rx="1.5"/>',
 'leaf': '<path d="M12 3l2 4 3-1-1 4 3 1-4 3 1 3-4-1v4-4l-4 1 1-3-4-3 3-1-1-4 3 1z"/>',
 'chip': '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
 'factory': '<path d="M3 20V10l6 4v-4l6 4V5h4v15z"/><path d="M7 17h2M12 17h2"/>',
 'clip': '<path d="M8 12.5 14.5 6a3 3 0 0 1 4.2 4.2l-8 8a4.5 4.5 0 0 1-6.4-6.4L11 5"/>',
 'truck': '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
 'brick': '<path d="M3 6h18v12H3zM3 12h18M9 6v6M15 12v6"/>',
 'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
 'bag': '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 'box': '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
 'users': '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5M16 5.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.8.7 3 2.5 3.5 5.2"/>',
 'flow': '<rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="15" width="7" height="5" rx="1"/><path d="M6.5 9v4.5a2 2 0 0 0 2 2H14"/>',
 'doc': '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 'chart': '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-7"/>',
 'repeat': '<path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5"/>',
 'percent': '<path d="M6 18 18 6"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
 'spark': '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 'pin': '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
 'home': '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
 'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
 'down': '<path d="m6 9 6 6 6-6"/>',
 'alert': '<path d="M12 4 3 20h18z"/><path d="M12 10v4.5M12 17.5v.01"/>',
 'chat': '<path d="M4 5h16v11H9l-5 4z"/>',
 'tag': '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
 'store': '<path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
 'scale': '<path d="M12 4v16M6 20h12M5 8h14M5 8l-2.5 6h5zM19 8l-2.5 6h5z"/>',
}

def ic(name, cls=''):
    return f'<svg class="ic {cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'

def sprite():
    return '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' + ''.join(
        f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items()) + '</svg>'

NAV = [('products', 'products.html', 'Products'), ('suppliers', 'suppliers.html', 'Suppliers'),
       ('requests', 'requests.html', 'Buying requests'), ('buyers', 'buyers.html', 'For buyers'),
       ('sell', 'sell.html', 'For suppliers'), ('companies', 'companies.html', 'Made in Canada'),
       ('how', 'how-it-works.html', 'How it works')]

def header(active):
    cur = lambda k: ' aria-current="page"' if k == active else ''
    cats = ''.join(f'<a href="{c["slug"]}.html">{ic(c["icon"])}<span><b>{c["name"]}</b><small>{c["blurb"]}</small></span></a>' for c in DATA['cats'])
    nav = ''.join(f'<a href="{h}"{cur(k)}>{t}</a>' for k, h, t in NAV)
    return f'''{sprite()}
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap">
  <span>{ic('leaf','ic-s')}Canadian suppliers. Prices in CAD.<span class="tb-sme">Backed by <a href="https://canadiansme.ca/">CanadianSME Small Business Magazine</a></span></span>
  <nav aria-label="Programs"><a href="order-protection.html">Order Protection</a><a href="net-terms.html">Net terms</a><a href="business.html">Business accounts</a><a href="contact.html">Help</a></nav>
</div></div>
<header class="head">
  <div class="wrap head-main">
    <a class="logo" href="index.html" aria-label="B2B Market home"><img src="assets/img/logo.png" alt="B2B Market, Simplifying B2B Trade" width="181" height="44"></a>
    <form class="search" role="search" action="products.html" autocomplete="off">
      <label class="sr" for="q">Search products, suppliers and categories</label>
      {ic('search')}<input id="q" name="q" type="search" placeholder="Search products, suppliers and categories" aria-controls="suggest" aria-autocomplete="list">
      <button type="submit">Search</button>
      <div class="suggest" id="suggest" role="listbox" hidden></div>
    </form>
    <div class="head-actions">
      <a class="act" href="{PORTAL}">{ic('user')}<span>Sign in</span></a>
      <a class="act" href="products.html?saved=1">{ic('heart')}<span>Saved</span><b class="count" id="savedCount" hidden>0</b></a>
      <a class="act" href="post-request.html">{ic('list')}<span>Quote list</span><b class="count" id="quoteCount" hidden>0</b></a>
      <a class="btn btn-buy" href="post-request.html">Post a request</a>
      <a class="btn btn-sell" href="sell.html">Sell here</a>
    </div>
  </div>
  <nav class="nav" aria-label="Main"><div class="wrap">
    <button class="nav-cats" id="catBtn" type="button" aria-expanded="false" aria-controls="catMenu">{ic('list','ic-s')}All categories{ic('down','ic-s')}</button>
    {nav}
  </div>
  <div class="catmenu" id="catMenu" hidden><div class="wrap"><div class="catmenu-grid">{cats}</div><a class="catmenu-all" href="categories.html">See all categories {ic('arrow','ic-s')}</a></div></div>
  </nav>
</header>'''

def footer():
    cats = ''.join(f'<a href="{c["slug"]}.html">{c["name"]}</a>' for c in DATA['cats'])
    return f'''<footer class="foot"><div class="wrap">
  <div class="foot-grid">
    <div class="foot-brand"><img src="assets/img/logo-white.png" alt="B2B Market" width="181" height="44">
      <p>Connecting Canadian buyers and suppliers in one marketplace.</p>
      <p>6345 Dixie Rd, Unit 202<br>Mississauga, ON L5T 1M9</p>
      <a href="mailto:info@b2bmarket.ca">info@b2bmarket.ca</a><a href="tel:+14377784446">+1 437 778 4446</a>
      <p class="tiny">Monday to Friday, 9 a.m. to 6 p.m. ET</p></div>
    <div><h2>Categories</h2>{cats}</div>
    <div><h2>For buyers</h2><a href="buyers.html">Why buy here</a><a href="products.html">Browse products</a><a href="suppliers.html">Find suppliers</a><a href="post-request.html">Post a request</a><a href="business.html">Business accounts</a><a href="net-terms.html">Net terms</a></div>
    <div><h2>For suppliers</h2><a href="sell.html">Why sell here</a><a href="requests.html">Open buying requests</a><a href="{REGISTER}">Register as a supplier</a><a href="https://www.b2bmarket.ca/vendor-hub/">Vendor Hub</a></div>
    <div><h2>Company</h2><a href="how-it-works.html">How it works</a><a href="order-protection.html">Order Protection</a><a href="companies.html">Made in Canada</a><a href="contact.html">Contact and help</a><a href="https://www.b2bmarket.ca/about/">About us</a><a href="https://www.b2bmarket.ca/privacy-policy/">Privacy Policy</a><a href="https://www.b2bmarket.ca/terms-of-service/">Terms of Service</a></div>
  </div>
  <div class="foot-sme"><span>From the team behind</span><a href="https://canadiansme.ca/"><b>CanadianSME</b> Small Business Magazine</a><a href="https://www.linkedin.com/company/b2b-market-built-to-strengthen-b2b-trade">LinkedIn</a></div>
  <div class="foot-base"><span>© 2026 B2B Market. Built for Canadian businesses.</span><span>Design prototype. Product, supplier and request rows are sample data.</span></div>
</div></footer>
<div class="tray" id="tray" hidden><div class="wrap"><strong>Compare</strong><div class="tray-items" id="trayItems"></div><button class="btn btn-ghost btn-s" id="trayClear" type="button">Clear</button><button class="btn btn-dark btn-s" id="trayGo" type="button">Compare products</button></div></div>
<div class="toast" id="toast" role="status" hidden></div>
<dialog id="cmpDlg" aria-labelledby="cmpTitle"><div class="dlg-head"><h2 id="cmpTitle">Compare products</h2><button class="btn btn-ghost btn-s" type="button" id="cmpClose">Close</button></div><div class="dlg-body" id="cmpBody"></div></dialog>'''

def layout(meta, body):
    attrs = ''.join(f' data-{k}="{html.escape(str(v))}"' for k, v in meta.get('data', {}).items())
    return f'''<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(meta["title"])} | B2B Market</title>
<meta name="description" content="{html.escape(meta["desc"])}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="icon" href="assets/img/logo.png">
</head>
<body data-page="{meta["page"]}"{attrs}>
{header(meta.get("nav", ""))}
<main id="main">
{body}
</main>
{footer()}
<script src="assets/js/data.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
'''

def icons_in(body):
    return re.sub(r'\{\{ic:([a-z]+)(?: ([a-z -]+))?\}\}', lambda m: ic(m.group(1), m.group(2) or ''), body)

def fill(tpl, vals):
    for k, v in vals.items():
        tpl = tpl.replace('{{' + k + '}}', str(v))
    return tpl

def main():
    (ROOT / 'assets/js/data.js').write_text('/* Generated from src/data.json by tools/build.py */\nwindow.B2B = ' + json.dumps(DATA, ensure_ascii=False) + ';\n', encoding='utf-8')
    n = 0
    for f in sorted((ROOT / 'src/pages').glob('*.html')):
        first, body = f.read_text(encoding='utf-8').split('\n', 1)
        meta = json.loads(first.removeprefix('<!--').removesuffix('-->'))
        body = fill(body, {'PORTAL': PORTAL, 'REGISTER': REGISTER})
        (ROOT / f.name).write_text(layout(meta, icons_in(body)), encoding='utf-8'); n += 1
    tpl = (ROOT / 'src/category.html').read_text(encoding='utf-8')
    for c in DATA['cats']:
        body = fill(tpl, {
            'name': c['name'], 'intro': c['intro'], 'products': c['products'], 'vendors': c['vendors'], 'img': c['img'], 'id': c['id'],
            'lower': c['name'].lower(), 'PORTAL': PORTAL, 'REGISTER': REGISTER,
            'tell': ''.join(f'<li>{ic("check","ic-s")}<span>{t}</span></li>' for t in c['tell']),
        })
        meta = {'title': f'{c["name"]} wholesale suppliers in Canada', 'desc': c['intro'], 'page': 'category', 'nav': '', 'data': {'cat': c['id']}}
        (ROOT / f'{c["slug"]}.html').write_text(layout(meta, icons_in(body)), encoding='utf-8'); n += 1
    print(f'built {n} pages')

if __name__ == '__main__':
    main()
