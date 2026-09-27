/**
 * NV Autodetailing – interacțiuni site
 */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // Header devine opac la scroll
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Meniu mobil
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  document.querySelectorAll("[data-menu-open]").forEach((b) => b.addEventListener("click", () => setMenu(true)));
  document.querySelectorAll("[data-menu-close]").forEach((b) => b.addEventListener("click", () => setMenu(false)));
  if (menu) menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Animații la scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elementele dintr-o grilă apar pe rând, nu toate deodată
  document.querySelectorAll(".services-grid, .steps, .benefits").forEach((grid) => {
    grid.querySelectorAll(":scope > .reveal").forEach((el, i) => {
      el.style.transitionDelay = Math.min(i, 6) * 90 + "ms";
    });
  });

  // Bara de progres a derulării și mișcarea ușoară a fundalului din hero
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  const heroImg = document.querySelector(".hero > img");
  let ticking = false;
  const onScrollFx = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    if (heroImg && !reduceMotion && window.scrollY < window.innerHeight * 1.2) {
      heroImg.style.translate = "0 " + window.scrollY * 0.25 + "px";
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFx); }
  }, { passive: true });
  onScrollFx();

  // Galeria: pozele apar pe rând când ajungi la ea
  const gallery = document.querySelector(".gallery");
  const staggerGallery = () => {
    if (!gallery) return;
    gallery.querySelectorAll("a:not([hidden])").forEach((a, i) => a.style.setProperty("--i", Math.min(i, 12)));
  };
  if (gallery && "IntersectionObserver" in window) {
    staggerGallery();
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { gallery.classList.add("in-view"); obs.disconnect(); }
    }, { threshold: 0.08 }).observe(gallery);
  } else if (gallery) {
    gallery.classList.add("in-view");
  }

  // Slider înainte / după
  document.querySelectorAll(".compare").forEach((cmp) => {
    const move = (x) => {
      const r = cmp.getBoundingClientRect();
      const p = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
      cmp.style.setProperty("--pos", p + "%");
    };
    let drag = false;
    let touched = false;
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const frames = [50, 32, 68, 50];
        const start = performance.now() + 400;
        const dur = 1800;
        const step = (now) => {
          if (touched) return;
          const t = Math.min(1, Math.max(0, (now - start) / dur));
          const seg = Math.min(frames.length - 2, Math.floor(t * (frames.length - 1)));
          const local = t * (frames.length - 1) - seg;
          const ease = 0.5 - Math.cos(local * Math.PI) / 2;
          cmp.style.setProperty("--pos", frames[seg] + (frames[seg + 1] - frames[seg]) * ease + "%");
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.5 }).observe(cmp);
    }
    cmp.addEventListener("pointerdown", (e) => {
      touched = true;
      drag = true;
      cmp.setPointerCapture(e.pointerId);
      move(e.clientX);
    });
    cmp.addEventListener("pointermove", (e) => drag && move(e.clientX));
    cmp.addEventListener("pointerup", () => (drag = false));
    cmp.addEventListener("keydown", (e) => {
      const cur = parseFloat(getComputedStyle(cmp).getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") cmp.style.setProperty("--pos", Math.max(0, cur - 5) + "%");
      if (e.key === "ArrowRight") cmp.style.setProperty("--pos", Math.min(100, cur + 5) + "%");
    });
  });

  // Carusel branduri (Swiper)
  if (typeof Swiper !== "undefined") {
    document.querySelectorAll(".init-swiper").forEach((el) => {
      const cfg = el.querySelector(".swiper-config");
      new Swiper(el, cfg ? JSON.parse(cfg.textContent.trim()) : {});
    });
  }

  // Lightbox pentru galerii
  let lightbox = null;
  if (typeof GLightbox !== "undefined") {
    lightbox = GLightbox({ selector: ".glightbox" });
  }

  // Filtre portofoliu
  const filters = document.querySelector(".filters");
  if (filters) {
    const items = document.querySelectorAll(".gallery a");
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      filters.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      const f = btn.dataset.filter;
      items.forEach((it) => {
        // La „Toate” doar selecția; pe categorie, toate pozele serviciului
        const show = f === "*" ? !("extra" in it.dataset) : it.dataset.cat === f;
        it.hidden = !show;
        it.classList.toggle("glightbox", show);
      });
      if (lightbox) lightbox.reload();
      const g = document.querySelector(".gallery");
      if (g) {
        g.classList.remove("in-view");
        g.querySelectorAll("a:not([hidden])").forEach((a, i) => a.style.setProperty("--i", Math.min(i, 12)));
        void g.offsetWidth;
        g.classList.add("in-view");
      }
    });
  }

  // Formular contact (Netlify Forms)
  const form = document.querySelector('form[name="nv-autodetailing-contact-form"]');
  if (form) {
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    const label = button.innerHTML;
    const show = (cls, msg) => {
      status.className = "form-status " + cls;
      status.textContent = msg;
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      button.disabled = true;
      button.textContent = "Se trimite...";
      status.className = "form-status";

      const data = new FormData(form);
      data.set("form-name", "nv-autodetailing-contact-form");

      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data).toString(),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show("ok", "Mulțumim! Mesajul a fost trimis, revenim cât de curând.");
      } catch (err) {
        show("err", "Mesajul nu a putut fi trimis. Sună-ne la 0773 724 926 sau scrie-ne pe WhatsApp.");
      } finally {
        button.disabled = false;
        button.innerHTML = label;
      }
    });
  }
})();
