# FormUp JC — site statique (HTML / CSS / JS vanilla)

Pages : index, formations, prevention-securite, a-propos, avis, contact.
Ouvrir via un serveur local (`python3 -m http.server`) plutôt qu'en `file://`.

- Design system : variables CSS en tête de `css/style.css`.
- Images : `assets/images/` (WebP). Photos Unsplash auto-hébergées ; remplaçables en gardant le nom du fichier.
- Formulaire : ajouter `data-endpoint="https://…"` (Formspree, Netlify, API) sur `<form data-contact-form>`.
  Sans endpoint, la messagerie du visiteur s'ouvre avec le message pré-rempli (mailto).
- Avant mise en ligne : vérifier les URL canoniques et `sitemap.xml` (domaine https://www.formupjc.com).
