# Rebuilding this design in the Wix Classic Editor

Everything on the site is made of: **full-width strips**, a **980 px content column** (Wix Classic default site width), **boxes**, **text**, **buttons**, **images**, **icons** and **1 px lines**. Nothing else.

## 1. Site setup
| Setting | Value |
|---|---|
| Site colours | Navy `#0B2540` · Dark navy `#071A2E` · Cyan `#22B8D1` · Light `#F2F6F8` · Text `#14283C` · White |
| Heading font | **Playfair Display**, bold |
| Body font | **Open Sans**, regular / bold |
| Sizes (desktop) | H1 52 · H2 38 · H3 22 · body 16 · small 14 · eyebrow 13 (bold, caps, letter-spacing 2) |
| Sizes (mobile) | H1 38 · H2 30 |
| Buttons | Rectangle, radius 4, height 48, bold 15 px. Primary = cyan fill / dark navy text, hover navy fill / white text. Outline = 2 px navy border, hover navy fill |
| Boxes | White fill, 1 px border `#DBE3EA`, no shadow, 28 px inner padding. Hover: border cyan |
| Lines | 1 px `#DBE3EA` |
| Animation | Only "Fade in" (or "Float in" 16 px) on entrance, once |
| Header | Pinned (fixed), white, 84 px, 1 px bottom line. Logo left, horizontal menu, "Demander un devis" button on the right |

Section spacing: **80 px top and bottom** on every strip (56 px on mobile). Every strip: content aligned to the 980 px grid.

## 2. Home page — strips in order
| # | Strip | Background | Layout / content |
|---|---|---|---|
| 1 | Hero | Photo `hero-bg.webp` + navy overlay 74 % | Left-aligned, 640 px wide: eyebrow, H1 (last line cyan), paragraph 19 px, 2 buttons, 2 tick items. Strip height ≈ 620 px |
| 2 | Trust bar | Cyan | 4 columns: icon + bold line + small line (navy text) |
| 3 | Formations | White | Centred eyebrow + H2, then **4 × 2 boxes**: icon in light-cyan circle, small caps duration, H3 20, text 15, "En savoir plus" link. Outline button below |
| 4 | Formation phare (SST) | Navy | 2 columns: image left · right = tag, eyebrow, H2, text, 4-cell fact table (thin white lines), 2 buttons |
| 5 | Pourquoi FormUp JC | Light | Centred heading, **3 × 2** text blocks: 3 px top line (cyan), number, H3, text |
| 6 | À propos | White | 2 columns: square portrait left · quote (cyan left bar), 2 paragraphs, outline button |
| 7 | Démarche en 4 étapes | Navy | 4 columns: big cyan number 44 px, H3, text, 1 px top line |
| 8 | Avis | Light | 3 review boxes (quote mark, text, name) + "Lire tous les avis" button |
| 9 | Appel à l'action | Cyan | 2 columns: H2 + text left · 2 buttons right (navy fill + navy outline) |
| 10 | Contact | White | 2 columns: contact details left · Wix Form in a bordered white box right |
| 11 | Footer | Dark navy | 4 columns: logo + text · navigation · formations · contact |

## 3. Other pages
All inner pages start with a **navy strip** (breadcrumb, eyebrow, H1 46, intro 19 px), then alternate **white / light** strips, and finish with the cyan call-to-action strip + footer.

- **Formations** — one strip per training (7), alternating white / light. 2 columns: left = eyebrow, H2 34, intro, photo; right = 2×2 spec box (Durée, Prérequis, Tarif inter, Tarif intra), objectives with tick icons, button. Then a navy "Financement" strip and a white FAQ strip (use Wix's expandable FAQ or 5 collapsible text boxes).
- **Prévention & Sécurité** — white (image + text) → light (6-row list: title left, text right, 1 px lines) → navy (Safety Day, text + image) → cyan CTA.
- **À propos** — white (portrait + text) → light (3 values) → white note box → cyan CTA.
- **Avis** — light strip with 10 review boxes in a 3-column grid → cyan CTA.
- **Contact** — white strip: details + tinted note left, form right.

## 4. Mobile view
Stack every column (image first, then text). Trust bar and the 4-column "étapes" become 2 columns then 1. Buttons full-width. Use the hamburger menu.

## 5. Assets
Upload everything in `assets/images/` (WebP works in Wix; the hero background should be added as a strip background image with a `#071A2E` overlay at ~74 %). Icons: use Wix's icon set (outlined style) or the SVGs from the sprite in the page source.

## 6. Content rules
Copy comes from the current formupjc.com site. Do not add prices, durations or claims that are not in the pages above.
