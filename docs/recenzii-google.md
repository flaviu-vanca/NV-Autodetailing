# Recenziile Google pe site

Secțiunea „Ce spun clienții noștri” citește automat toate recenziile Google ale NV AutoDetailing, prin serviciul SerpApi, și le afișează în stilul site-ului.

## Cum funcționează

1. Pagina cere datele de la `/api/recenzii` (funcția `netlify/functions/recenzii.mts`).
2. Funcția citește de la SerpApi nota medie, numărul total și toate recenziile, pagină cu pagină, de la cele mai noi.
3. Răspunsul rămâne în cache-ul Netlify 24 de ore, deci SerpApi e apelat cam o dată pe zi, nu la fiecare vizitator.
4. Dacă cheia lipsește sau SerpApi nu răspunde, pagina afișează automat widgetul Elfsight, ca secțiunea să nu rămână goală.

## Configurare (o singură dată)

1. Creează un cont pe https://serpapi.com și copiază cheia din pagina „Api Key”.
2. În Netlify: proiectul `nvautodetailing` > **Project configuration** > **Environment variables** > **Add a variable**:
   - Key: `SERPAPI_KEY`
   - Value: cheia de la SerpApi
   - Scopes: toate (ca să meargă și pe linkurile de previzualizare)
3. În Netlify, la **Deploys**, apasă **Trigger deploy** (sau „Retry deploy” pe linkul de previzualizare) ca site-ul să preia cheia.

Opțional, `SERPAPI_DATA_ID` schimbă locația Google Maps. Implicit e cea a NV AutoDetailing din Gottlob (`0x47451d38c4c5f611:0xb6cd54459a8589ff`).

## Costuri

Fiecare pagină de recenzii citită consumă o căutare din abonamentul SerpApi (prima pagină are până la 8 recenzii, următoarele până la 20). Cu cache de 24 de ore, consumul e de câteva căutări pe zi. Verifică pe serpapi.com dacă planul gratuit ajunge sau ce plan se potrivește.
