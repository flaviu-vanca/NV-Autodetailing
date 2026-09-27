/**
 * Widget recenzii Google: date din /api/recenzii (funcția Netlify).
 * Dacă funcția nu e configurată sau nu răspunde, încarcă widgetul Elfsight.
 */
(function () {
  "use strict";

  const root = document.querySelector("[data-reviews]");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rtf = "Intl" in window && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat("ro", { numeric: "auto" }) : null;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const starSvg =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
  const stars = (value) => {
    const pct = Math.max(0, Math.min(100, (value / 5) * 100));
    const row = starSvg.repeat(5);
    return `<span class="rv-stars" aria-label="${String(value).replace(".", ",")} din 5 stele"><span class="rv-stars-bg">${row}</span><span class="rv-stars-fg" style="width:${pct}%">${row}</span></span>`;
  };

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

  // În română: „14 recenzii”, dar „57 de recenzii” (de la 20 în sus)
  const count = (n, word) => {
    const r = n % 100;
    return `${n} ${n !== 0 && (r === 0 || r >= 20) ? "de " : ""}${word}`;
  };

  const initials = (name) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

  const card = (r) => {
    const avatar = r.photo
      ? `<img src="${esc(r.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
      : `<span>${esc(initials(r.name))}</span>`;
    const name = r.link
      ? `<a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.name)}</a>`
      : esc(r.name);
    const reply = r.reply
      ? `<details class="rv-reply"><summary>Răspunsul nostru</summary><p>${esc(r.reply)}</p></details>`
      : "";
    return `<article class="rv-card">
        <header>
          <div class="rv-avatar">${avatar}</div>
          <div><div class="rv-name">${name}</div><div class="rv-date">${esc(ago(r.date))}</div></div>
          <svg class="rv-g" viewBox="0 0 48 48" aria-label="Google"><use href="#g-logo"/></svg>
        </header>
        ${stars(r.rating)}
        <p class="rv-text">${esc(r.text)}</p>
        <button class="rv-more" type="button" hidden>Citește tot</button>
        ${reply}
      </article>`;
  };

  // Butonul „Citește tot” apare doar la textele tăiate
  const wireMore = (scope) => {
    scope.querySelectorAll(".rv-card").forEach((c) => {
      const p = c.querySelector(".rv-text");
      const btn = c.querySelector(".rv-more");
      if (p.scrollHeight > p.clientHeight + 2) {
        btn.hidden = false;
        btn.addEventListener("click", () => {
          const open = c.classList.toggle("open");
          btn.textContent = open ? "Arată mai puțin" : "Citește tot";
        });
      }
    });
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
    const withText = data.reviews.filter((r) => r.text);
    const rating = data.rating ?? data.reviews.reduce((a, r) => a + r.rating, 0) / (data.reviews.length || 1);

    root.querySelector("[data-rv-rating]").textContent = rating.toFixed(1).replace(".", ",");
    root.querySelector("[data-rv-stars]").innerHTML = stars(rating);
    root.querySelector("[data-rv-count]").textContent = `din ${count(data.total, "recenzii")}`;
    root.querySelectorAll("[data-rv-maps]").forEach((a) => (a.href = data.mapsUrl));

    const track = root.querySelector(".rv-track");
    track.innerHTML = withText.map(card).join("");
    root.hidden = false;
    wireMore(track);

    // Lista completă, într-o fereastră
    const modal = document.getElementById("rv-modal");
    const list = modal.querySelector(".rv-list");
    const allBtn = root.querySelector("[data-rv-all]");
    allBtn.textContent = `Vezi toate (${data.reviews.length})`;
    allBtn.addEventListener("click", () => {
      if (!list.childElementCount) {
        list.innerHTML = data.reviews
          .map((r) => (r.text ? r : { ...r, text: "" }))
          .map(card)
          .join("");
        wireMore(list);
      }
      modal.showModal();
      document.body.style.overflow = "hidden";
    });
    modal.addEventListener("close", () => (document.body.style.overflow = ""));
    modal.querySelector("[data-rv-close]").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => e.target === modal && modal.close());

    // Carusel: săgeți, glisare și derulare automată
    const step = () => {
      const c = track.querySelector(".rv-card");
      return c ? c.getBoundingClientRect().width + 20 : 320;
    };
    const go = (dir) => {
      const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (dir > 0 && end) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: dir * step(), behavior: "smooth" });
    };
    root.querySelector("[data-rv-prev]").addEventListener("click", () => go(-1));
    root.querySelector("[data-rv-next]").addEventListener("click", () => go(1));

    if (!reduceMotion) {
      let paused = false;
      ["mouseenter", "touchstart", "focusin"].forEach((ev) => track.addEventListener(ev, () => (paused = true), { passive: true }));
      ["mouseleave", "focusout"].forEach((ev) => track.addEventListener(ev, () => (paused = false)));
      setInterval(() => {
        const r = track.getBoundingClientRect();
        if (!paused && !document.hidden && r.top < window.innerHeight && r.bottom > 0) go(1);
      }, 6000);
    }
  };

  fetch("/api/recenzii", { headers: { Accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => (data && data.reviews && data.reviews.length ? render(data) : fallback()))
    .catch(fallback);
})();
