# B2B Market: new marketplace design

A front-end prototype for [b2bmarket.ca](https://www.b2bmarket.ca), the Canadian wholesale marketplace backed by CanadianSME. Static HTML, CSS and JavaScript.

## View it

Open `index.html`, or turn on GitHub Pages (Settings, Pages, deploy from this branch, `/ (root)`).

## Pages

| Area | Files |
| --- | --- |
| Home | `index.html` |
| Categories | `categories.html` and one page each: `electronics.html`, `industrial-equipment.html`, `office-supplies.html`, `transportation.html`, `building-materials.html`, `energy-solutions.html`, `retail-products.html`, `packaging.html` |
| Products | `products.html` (filters, sort, search), `product.html?id=p1` |
| Suppliers | `suppliers.html`, `supplier.html?id=s1` |
| Requests | `requests.html` (board for suppliers), `post-request.html` (form for buyers) |
| Audiences | `buyers.html`, `sell.html` |
| Programs | `order-protection.html`, `net-terms.html`, `business.html` |
| Company | `how-it-works.html`, `companies.html`, `contact.html` |

## Design

The look follows canadiansme.ca: white pages, cool greys, Sora headings over IBM Plex Sans, a short red rule under page titles, and a dark navy hero. Blue marks the buyer's path and red marks the supplier's path on every page.

## Smart features (rule-based, no AI service connected)

- **Request reader.** Type a need in plain words on the home page or `post-request.html`. It picks out quantity, city, province, timing and category, fills the form, suggests matching listings with a cost estimate, and shows what suppliers in that category usually ask.
- **Request strength.** A meter on the request form shows what is missing for comparable quotes.
- **Search suggestions.** The header search suggests categories, products and suppliers as you type.
- **Quote checks.** The home page example shows quotes flagged for a missing delivery cost and a specification below the request.
- **Other suppliers for this.** Product pages list the same kind of product from other suppliers.
- **Category guidance.** Each category page lists what to include in a request for that kind of product.

## Editing

Do not edit the root `.html` files or `assets/js/data.js` by hand. They are generated.

- Data: `src/data.json`
- Page bodies: `src/pages/*.html` (first line is the page's title and description)
- Category pages: `src/category.html` (one template for all eight)
- Header, footer and icons: `tools/build.py`
- Styles and behaviour: `assets/css/styles.css`, `assets/js/app.js`

Then run `python3 tools/build.py`.

## Real data and sample data

Real, from b2bmarket.ca and canadiansme.ca: the eight categories with product and vendor counts, the 21 named onboarded companies with logos, the "100 companies, six provinces" figure, contact details, the FAQ, the comparison table, photos, and three CanadianSME article links.

Sample, labelled on screen: the 21 product listings, 11 suppliers, 10 buying requests, the quote comparison example and the business account figures.

Order Protection, net terms and business accounts are marked "Coming soon" or "Concept". No form sends anything.

## Before launch

- Copy the photos and partner logos into this repository. They load from b2bmarket.ca today.
- Connect search, requests, sign-in and messaging to portal.b2bmarket.ca.
- Confirm the category counts, the verification criteria and permission for each company logo.
- Publish terms for Order Protection and net terms before removing the "Coming soon" labels.
