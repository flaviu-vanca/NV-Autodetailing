/**
 * Widget recenzii Google: date din /api/recenzii (funcția Netlify), aspect ca widgetul Elfsight.
 * Dacă funcția nu e configurată sau nu răspunde, încarcă widgetul Elfsight.
 */
(function () {
  "use strict";

  const root = document.querySelector("[data-reviews]");
  if (!root) return;

  const rtf = "Intl" in window && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat("ro", { numeric: "auto" }) : null;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const starSvg =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z"/></svg>';
  const stars = (value) => {
    const pct = Math.max(0, Math.min(100, (value / 5) * 100));
    const row = starSvg.repeat(5);
    return `<span class="rv-stars" aria-label="${String(value).replace(".", ",")} din 5 stele"><span class="rv-stars-bg">${row}</span><span class="rv-stars-fg" style="width:${pct}%">${row}</span></span>`;
  };
  const verified =
    '<svg viewBox="0 0 24 24" aria-label="Verificat"><path fill="#e2b33c" d="M12 1l2.6 1.9 3.2-.2 1 3.1 2.7 1.8-.9 3.1.9 3.1-2.7 1.8-1 3.1-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3.1-2.7-1.8.9-3.1-.9-3.1 2.7-1.8 1-3.1 3.2.2z"/><path fill="#111" d="M10.6 15.6l-3.2-3.2 1.4-1.4 1.8 1.8 4.6-4.6 1.4 1.4z"/></svg>';
  const gBadge = '<svg class="rv-g" viewBox="0 0 48 48" aria-hidden="true"><use href="#g-logo"/></svg>';

  // În română: „14 recenzii”, dar „39 de recenzii” (de la 20 în sus)
  const count = (n, word) => {
    const r = n % 100;
    return `${n} ${n !== 0 && (r === 0 || r >= 20) ? "de " : ""}${word}`;
  };

  const label = (rating) =>
    rating >= 4.5 ? "Excelent" : rating >= 4 ? "Foarte bun" : rating >= 3.5 ? "Bun" : rating >= 3 ? "Satisfăcător" : "Slab";

  const ago = (iso) => {
    if (!iso || !rtf) return "";
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
    ];
    for (const [unit, sec] of units) {
      if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
    }
    return "chiar acum";
  };

  // Culoare stabilă pentru inițiala fiecărui client, ca la Google
  const palette = ["#5e35b1", "#0288d1", "#00897b", "#e53935", "#6d4c41", "#3949ab", "#c2185b", "#7cb342", "#f4511e", "#546e7a"];
  const colorFor = (name) => palette[[...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % palette.length];

  const avatar = (r) =>
    `<div class="rv-avatar">${
      r.photo
        ? `<img src="${esc(r.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
        : `<span class="rv-initial" style="background:${colorFor(r.name)}">${esc((r.name.trim()[0] || "?").toUpperCase())}</span>`
    }${gBadge}</div>`;

  const card = (r, i, full) => {
    const name = r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.name)}</a>` : esc(r.name);
    const reply =
      full && r.reply ? `<div class="rv-reply"><strong>Răspunsul NV Autodetailing</strong>${esc(r.reply)}</div>` : "";
    return `<article class="rv-card"${full ? "" : ` data-i="${i}"`}>
        <header>${avatar(r)}<div><div class="rv-name">${name} ${verified}</div><div class="rv-date">${esc(ago(r.date))}</div></div></header>
        ${stars(r.rating)}
        <p class="rv-text">${esc(r.text)}</p>
        ${full ? reply : '<button class="rv-more" type="button" hidden>Citește mai mult</button>'}
      </article>`;
  };

  const fallback = () => {
    root.hidden = true;
    const box = document.querySelector("[data-reviews-fallback]");
    if (!box) return;
    box.hidden = false;
    const s = document.createElement("script");
    s.src = "https://static.elfsight.com/platform/platform.js";
    s.async = true;
    document.body.appendChild(s);
  };

  const render = (data) => {
    const list = data.reviews.filter((r) => r.text);
    const rating = data.rating ?? data.reviews.reduce((a, r) => a + r.rating, 0) / (data.reviews.length || 1);

    root.querySelector("[data-rv-label]").textContent = label(rating);
    root.querySelector("[data-rv-stars]").innerHTML = stars(rating);
    root.querySelector("[data-rv-rating]").textContent = rating.toFixed(1).replace(".", ",");
    root.querySelector("[data-rv-count]").textContent = `din 5 bazat pe ${count(data.total, "recenzii")}`;
    root.querySelectorAll("[data-rv-maps]").forEach((a) => (a.href = data.mapsUrl));

    const track = root.querySelector(".rv-track");
    // Cardurile apar de două ori, ca derularea să continue fără salt vizibil după ultima recenzie
    const once = list.map((r, i) => card(r, i, false)).join("");
    track.innerHTML = once + (list.length > 1 ? once : "");
    [...track.children].slice(list.length).forEach((c) => c.setAttribute("aria-hidden", "true"));
    root.hidden = false;

    // „Citește mai mult” apare doar la textele tăiate și deschide recenzia întreagă
    const modal = document.getElementById("rv-modal");
    const body = modal.querySelector(".rv-modal-body");
    track.querySelectorAll(".rv-card").forEach((c) => {
      const p = c.querySelector(".rv-text");
      const btn = c.querySelector(".rv-more");
      if (p.scrollHeight > p.clientHeight + 2 || list[c.dataset.i].reply) {
        btn.hidden = false;
        btn.addEventListener("click", () => {
          body.innerHTML = card(list[c.dataset.i], 0, true);
          modal.showModal();
          document.body.style.overflow = "hidden";
        });
      }
    });
    modal.addEventListener("close", () => (document.body.style.overflow = ""));
    modal.querySelector("[data-rv-close]").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => e.target === modal && modal.close());

    // Carusel fără sfârșit: se mișcă singur de la dreapta spre stânga
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = () => {
      const c = track.querySelector(".rv-card");
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 320;
    };
    const setWidth = () => step() * list.length;
    const jump = (left) => {
      track.style.scrollBehavior = "auto";
      track.style.scrollSnapType = "none";
      track.scrollLeft = left;
      void track.offsetWidth;
      track.style.scrollBehavior = "";
      track.style.scrollSnapType = "";
    };
    // Când am ajuns în setul dublat, revenim instant în primul set (arată identic)
    const wrap = () => {
      if (list.length < 2) return;
      const w = setWidth();
      if (track.scrollLeft >= w - 2) jump(track.scrollLeft - w);
    };
    const go = (dir) => {
      if (list.length < 2) return;
      if (dir < 0 && track.scrollLeft < step() / 2) jump(track.scrollLeft + setWidth());
      track.scrollBy({ left: dir * step() });
    };
    root.querySelector("[data-rv-prev]").addEventListener("click", () => go(-1));
    root.querySelector("[data-rv-next]").addEventListener("click", () => go(1));

    let settle;
    track.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(updateDots);
        clearTimeout(settle);
        settle = setTimeout(wrap, 160);
      },
      { passive: true }
    );

    const dots = root.querySelector(".rv-dots");
    function updateDots() {
      const pages = list.length;
      if (dots.childElementCount !== pages) dots.innerHTML = "<span></span>".repeat(pages);
      const active = Math.round(track.scrollLeft / step()) % pages;
      [...dots.children].forEach((d, i) => {
        const dist = Math.min(Math.abs(i - active), pages - Math.abs(i - active));
        d.className = dist === 0 ? "on" : dist === 1 ? "near" : dist > 2 ? "far" : "";
      });
    }
    window.addEventListener("resize", updateDots);
    updateDots();

    // Derulare automată; se oprește cât timp vizitatorul ține mouse-ul pe carusel sau îl atinge
    if (!reduceMotion && list.length > 1) {
      let pausedUntil = 0;
      let hover = false;
      track.addEventListener("mouseenter", () => (hover = true));
      track.addEventListener("mouseleave", () => (hover = false));
      ["touchstart", "pointerdown", "wheel"].forEach((ev) =>
        track.addEventListener(ev, () => (pausedUntil = Date.now() + 6000), { passive: true })
      );
      root.querySelectorAll(".rv-nav").forEach((b) => b.addEventListener("click", () => (pausedUntil = Date.now() + 6000)));
      setInterval(() => {
        const r = track.getBoundingClientRect();
        const visible = r.top < window.innerHeight && r.bottom > 0;
        if (!hover && !document.hidden && visible && !modal.open && Date.now() > pausedUntil) go(1);
      }, 4000);
    }
  };

  fetch("/api/recenzii", { headers: { Accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => (data && data.reviews && data.reviews.length ? render(data) : fallback()))
    .catch(fallback);
})();
