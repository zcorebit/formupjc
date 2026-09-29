/* FormUp JC — vanilla JS, no dependencies. Each feature is a small isolated init. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sticky header: border + shadow once the page is scrolled */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* Mobile menu */
  function initMenu() {
    const toggle = $(".menu-toggle");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;
    const mq = window.matchMedia("(min-width: 64em)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      // Keep hidden links out of the tab order on mobile
      nav.inert = !open && !mq.matches;
    };

    setOpen(false);
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    mq.addEventListener("change", () => setOpen(false));
  }

  /* Scroll reveal (IntersectionObserver) */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* Back to top */
  function initToTop() {
    const btn = $(".to-top");
    if (!btn) return;
    const update = () => btn.classList.toggle("is-visible", window.scrollY > 900);
    update();
    window.addEventListener("scroll", update, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* Testimonials carousel: native scroll-snap + prev/next buttons */
  function initReviews() {
    const track = $("[data-reviews]");
    if (!track) return;
    const prev = $("[data-reviews-prev]");
    const next = $("[data-reviews-next]");
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 24;
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /* Contact form: client-side validation.
     Delivery: if the form has data-endpoint, POST there (Formspree, Netlify, custom API…).
     Otherwise, fall back to opening the visitor's mail client with the message pre-filled. */
  function initForms() {
    $$("form[data-contact-form]").forEach((form) => {
      const status = $(".form__status", form);
      const fields = $$("[data-validate]", form);

      const rules = {
        name: (v) => (v.trim().length >= 2 ? "" : "Merci d’indiquer votre nom."),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Merci d’indiquer une adresse e-mail valide."),
        phone: (v) => (!v.trim() || /^[+()\d\s.-]{8,20}$/.test(v.trim()) ? "" : "Ce numéro de téléphone semble incorrect."),
        message: (v) => (v.trim().length >= 10 ? "" : "Votre message doit contenir au moins 10 caractères."),
      };

      const check = (input) => {
        const rule = rules[input.dataset.validate];
        const msg = rule ? rule(input.value) : "";
        const err = document.getElementById(input.getAttribute("aria-describedby"));
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        if (err) err.textContent = msg;
        return !msg;
      };

      fields.forEach((input) => {
        input.addEventListener("blur", () => check(input));
        input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true") check(input); });
      });

      const setStatus = (type, text) => {
        status.className = "form__status" + (type ? " is-" + type : "");
        status.textContent = text;
      };

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const results = fields.map(check);
        if (results.includes(false)) {
          fields[results.indexOf(false)].focus();
          setStatus("error", "Merci de corriger les champs signalés avant d’envoyer votre demande.");
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        if (data.website) return; // honeypot

        const endpoint = form.dataset.endpoint;
        if (endpoint) {
          const btn = $("button[type=submit]", form);
          btn.disabled = true;
          try {
            const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
            if (!res.ok) throw new Error(res.status);
            form.reset();
            setStatus("success", "Merci, votre demande a bien été envoyée. Nous vous répondons rapidement.");
          } catch {
            setStatus("error", "L’envoi a échoué. Vous pouvez nous écrire directement à " + form.dataset.mailto + ".");
          } finally {
            btn.disabled = false;
          }
          return;
        }

        const subject = "Demande de devis — " + (data.subject || "formation");
        const body = [
          "Nom : " + data.name,
          "E-mail : " + data.email,
          data.company ? "Entreprise : " + data.company : "",
          data.phone ? "Téléphone : " + data.phone : "",
          "",
          data.message,
        ].filter((l, i) => l || i > 3).join("\n");
        setStatus("success", "Votre messagerie va s’ouvrir avec votre demande pré-remplie. Il ne vous reste qu’à l’envoyer.");
        window.location.href = "mailto:" + form.dataset.mailto + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      });
    });
  }

  document.documentElement.classList.add("js");
  const start = () => { initHeader(); initMenu(); initReveal(); initToTop(); initReviews(); initForms(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
