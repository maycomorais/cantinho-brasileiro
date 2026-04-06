// supabase/functions/calcular-distancia/index.ts
// Edge Function — Cantinho Brasileiro
//
// Responsabilidade:
//   Recebe { lat, lng } do browser e retorna a distância em KM
//   usando OSRM (rota real) com fallback automático para Haversine.
//   Resolve o bloqueio de CORS do router.project-osrm.org no browser.
//
// Deploy:
//   supabase functions deploy calcular-distancia --project-ref <REF>
//
// Variáveis de ambiente (automáticas no Supabase):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (não usadas aqui, mas disponíveis)

// ── Coordenadas da loja ───────────────────────────────────────────────────
const COORD_LOJA = { lat: -25.2365803, lng: -57.5380816 };

// ── CORS ──────────────────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── Haversine (fallback quando OSRM falha) ────────────────────────────────
function distanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Distância pela rota real (OSRM público) ───────────────────────────────
async function distanciaOSRM(latDest: number, lngDest: number): Promise<number | null> {
  const origem  = `${COORD_LOJA.lng},${COORD_LOJA.lat}`;
  const destino = `${lngDest},${latDest}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${origem};${destino}?overview=false`;

  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const d = await r.json();
    if (d.code === "Ok" && d.routes?.[0]?.distance) {
      return d.routes[0].distance / 1000; // metros → km
    }
    return null;
  } catch {
    return null;
  }
}

// ── Handler principal ─────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido. Use POST." }),
      { status: 405, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  try {
    const { lat, lng } = await req.json();

    if (typeof lat !== "number" || typeof lng !== "number") {
      return new Response(
        JSON.stringify({ error: "Parâmetros inválidos. Envie { lat: number, lng: number }" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Tenta rota real via OSRM (server-side — sem bloqueio de CORS)
    let distancia_km = await distanciaOSRM(lat, lng);
    let metodo: "osrm" | "haversine";

    if (distancia_km !== null) {
      metodo = "osrm";
    } else {
      // Fallback: distância em linha reta (Haversine)
      distancia_km = distanciaHaversine(COORD_LOJA.lat, COORD_LOJA.lng, lat, lng);
      metodo = "haversine";
      console.warn(`[calcular-distancia] OSRM indisponível — usando Haversine. dist=${distancia_km.toFixed(2)}km`);
    }

    return new Response(
      JSON.stringify({ distancia_km, metodo }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[calcular-distancia] Erro inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
