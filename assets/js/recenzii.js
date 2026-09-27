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
    '<svg viewBox="0 0 24 24" aria-label="Verificat"><path fill="#1a5bc4" d="M12 1l2.6 1.9 3.2-.2 1 3.1 2.7 1.8-.9 3.1.9 3.1-2.7 1.8-1 3.1-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3.1-2.7-1.8.9-3.1-.9-3.1 2.7-1.8 1-3.1 3.2.2z"/><path fill="#fff" d="M10.6 15.6l-3.2-3.2 1.4-1.4 1.8 1.8 4.6-4.6 1.4 1.4z"/></svg>';
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
    track.innerHTML = list.map((r, i) => card(r, i, false)).join("");
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

    // Carusel: săgeți, glisare și puncte de navigare
    const perView = () => {
      const c = track.querySelector(".rv-card");
      return c ? Math.max(1, Math.round(track.clientWidth / (c.getBoundingClientRect().width + 20))) : 1;
    };
    const step = () => {
      const c = track.querySelector(".rv-card");
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 320;
    };
    const go = (dir) => {
      const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (dir > 0 && end) track.scrollTo({ left: 0 });
      else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth });
      else track.scrollBy({ left: dir * step() });
    };
    root.querySelector("[data-rv-prev]").addEventListener("click", () => go(-1));
    root.querySelector("[data-rv-next]").addEventListener("click", () => go(1));

    const dots = root.querySelector(".rv-dots");
    const updateDots = () => {
      const pages = Math.max(1, list.length - perView() + 1);
      if (dots.childElementCount !== pages) dots.innerHTML = "<span></span>".repeat(pages);
      const active = Math.min(pages - 1, Math.round(track.scrollLeft / step()));
      [...dots.children].forEach((d, i) => {
        const dist = Math.abs(i - active);
        d.className = dist === 0 ? "on" : dist === 1 ? "near" : dist > 2 ? "far" : "";
      });
    };
    track.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
    window.addEventListener("resize", updateDots);
    updateDots();
  };

  fetch("/api/recenzii", { headers: { Accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => (data && data.reviews && data.reviews.length ? render(data) : fallback()))
    .catch(fallback);
})();
