/* FormUp JC — vanilla JS, no dependencies. Each feature is a small isolated init. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* Mobile menu */
  function initMenu() {
    const toggle = $(".menu-toggle");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;
    const mq = window.matchMedia("(min-width: 901px)");

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
  const start = () => { initMenu(); initReveal(); initForms(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
