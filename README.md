# B2B Market: new marketplace design

A front-end prototype for [b2bmarket.ca](https://www.b2bmarket.ca), the Canadian wholesale marketplace backed by CanadianSME. It keeps the B2B Market brand (navy, the maple-leaf logo, Sora and IBM Plex Sans) and adds the features buyers expect from the large B2B marketplaces.

## View it

Plain HTML, CSS and JavaScript. No build step.

- Open `index.html` in a browser, or
- Turn on GitHub Pages (Settings, Pages, deploy from branch) to get a public link, or
- Import the repository into Vercel as a static site.

## Pages

| Page | File | What it shows |
| --- | --- | --- |
| Homepage | `index.html` | Request composer hero, category rail, quantity-price product cards, rankings, open buying requests, onboarded companies, Order Protection, business tools, net terms |
| Product | `product.html?id=p1` | Price ladder with live quantity calculator, options, customization, sample order, supplier card, lead times, reviews and questions |
| Supplier storefront | `supplier.html` | Verification checklist, certificates, capabilities, ownership, trading terms, products |
| Buying requests | `requests.html` | Filterable board of open requests with quote slots, plus the post-a-request form |
| Business account | `business.html` | Approvals, team spending limits, spend by category, invoices on net terms, reorder lists, tax exemption |

## What was adopted, and from where

| Feature | Seen on | Where it is here |
| --- | --- | --- |
| Category rail beside the hero, account box on the right | Alibaba | Homepage hero |
| Post one request, many suppliers quote; limited quote slots | Alibaba RFQ, IndiaMART | Hero composer, `requests.html` |
| Price breaks by quantity on every listing | Amazon Business, Alibaba | Price ladder on cards and product page |
| Payment held until delivery | Alibaba Trade Assurance | Order Protection (marked coming soon) |
| Supplier verification shown as a checklist, certificates only when a document is on file | Alibaba Verified, IndiaMART TrustSEAL, Thomasnet | `supplier.html` |
| Ownership and capability filters | Thomasnet | Supplier storefront tags |
| Sample orders and low-risk first orders | Alibaba, Faire | Product page, homepage |
| Net 30/60/90 terms | Faire, Amazon Business Pay by Invoice | Homepage, business account (coming soon) |
| Team accounts, approvals, PO numbers, spend reports, reorder lists, tax exemption | Amazon Business | `business.html` |
| Compare products side by side, saved items | Alibaba, Amazon Business | Compare tray on product cards, heart button |
| Search by photo | Alibaba | Camera button in search (placeholder) |
| Reviews only from completed orders | Faire, Amazon | Empty states on product and supplier pages |

## Real data and sample data

Real, taken from b2bmarket.ca: the eight categories with their product and vendor counts, the 21 named onboarded companies and their cities, the "100 companies, six provinces" figure, contact details, and the category photos (loaded from b2bmarket.ca).

Sample, labelled on screen: product listings, suppliers, buying requests and the business dashboard. They live at the top of `assets/js/app.js` and are meant to be replaced by API calls.

Order Protection, net terms, sample orders and the business account are concepts and are marked "Coming soon" or "Concept". No form sends anything yet.

## Before launch

- Move the category photos into this repository instead of loading them from the live site.
- Connect search, requests, sign-in and messaging to the portal at portal.b2bmarket.ca.
- Confirm the category counts. The live browse page shows thousands of products per category while the live homepage calls its listings samples.
- Get written permission for each company name and logo shown.
- Publish the terms for Order Protection and net terms before removing the "Coming soon" labels.
