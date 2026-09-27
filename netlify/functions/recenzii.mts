/**
 * Recenziile Google ale NV Autodetailing, citite prin SerpApi (Google Maps Reviews API).
 *
 * Variabile de mediu (Netlify > Project configuration > Environment variables):
 *   SERPAPI_KEY      obligatorie, cheia de la serpapi.com
 *   SERPAPI_DATA_ID  opțională, ID-ul locației Google Maps (implicit NV AutoDetailing Gottlob)
 *
 * Răspunsul e ținut în cache-ul Netlify 24 de ore, ca SerpApi să fie apelat rar.
 */

const DEFAULT_DATA_ID = "0x47451d38c4c5f611:0xb6cd54459a8589ff";
const MAX_PAGES = 15;

type Review = {
  name: string;
  photo: string | null;
  link: string | null;
  rating: number;
  date: string | null;
  text: string;
  reply: string | null;
};

const json = (body: unknown, status: number, cacheSeconds: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": `public, durable, s-maxage=${cacheSeconds}, stale-while-revalidate=604800`,
    },
  });

export default async () => {
  const apiKey = Netlify.env.get("SERPAPI_KEY");
  if (!apiKey) return json({ configured: false }, 503, 60);

  const dataId = Netlify.env.get("SERPAPI_DATA_ID") || DEFAULT_DATA_ID;
  const reviews: Review[] = [];
  let place: { title?: string; rating?: number; reviews?: number } = {};
  let nextPageToken: string | undefined;

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const params = new URLSearchParams({
        engine: "google_maps_reviews",
        data_id: dataId,
        hl: "ro",
        sort_by: "newestFirst",
        api_key: apiKey,
      });
      if (nextPageToken) {
        params.set("next_page_token", nextPageToken);
        params.set("num", "20");
      }

      const res = await fetch(`https://serpapi.com/search.json?${params}`);
      if (!res.ok) throw new Error(`SerpApi ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (page === 0 && data.place_info) place = data.place_info;

      for (const r of data.reviews ?? []) {
        const text = (r.extracted_snippet?.original ?? r.snippet ?? "").trim();
        reviews.push({
          name: r.user?.name ?? "Client Google",
          photo: r.user?.thumbnail ?? null,
          link: r.user?.link ?? null,
          rating: Number(r.rating) || 0,
          date: r.iso_date ?? null,
          text,
          reply: r.response?.extracted_snippet?.original ?? r.response?.snippet ?? null,
        });
      }

      nextPageToken = data.serpapi_pagination?.next_page_token;
      if (!nextPageToken) break;
    }
  } catch (err) {
    console.error("Recenzii: nu am putut citi datele", err);
    return json({ configured: true, error: true }, 502, 300);
  }

  return json(
    {
      configured: true,
      name: place.title ?? "NV AutoDetailing",
      rating: place.rating ?? null,
      total: place.reviews ?? reviews.length,
      mapsUrl: `https://www.google.com/maps/place/data=!4m2!3m1!1s${dataId}`,
      reviews,
      updatedAt: new Date().toISOString(),
    },
    200,
    86400,
  );
};

export const config = {
  path: "/api/recenzii",
};
