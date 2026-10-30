import { getStore } from "@netlify/blobs";

const LOWERCASE_WORDS = new Set([
  "da", "de", "do", "das", "dos", "e", "em", "na", "no", "nas", "nos"
]);

function formatProperName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && LOWERCASE_WORDS.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function padSequential(num) {
  return String(num).padStart(4, "0");
}

async function readState(store) {
  try {
    const data = await store.get("registry", { type: "json" });
    if (data && typeof data.lastNumber === "number" && Array.isArray(data.agents)) {
      return data;
    }
  } catch {
    // Ignore and return default
  }
  return { lastNumber: 0, agents: [] };
}

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  try {
    const store = getStore("meto-registry");

    if (req.method === "GET") {
      const db = await readState(store);
      return new Response(
        JSON.stringify({
          lastNumber: db.lastNumber,
          nextFormattedNumber: padSequential(db.lastNumber + 1),
          agents: db.agents,
        }),
        { status: 200, headers }
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      const codinome = formatProperName(body.codinome).slice(0, 36);
      const cidade = formatProperName(body.cidade).slice(0, 40);
      const uf = String(body.uf || "").trim().toUpperCase().slice(0, 2);

      if (!codinome || !cidade || !uf) {
        return new Response(
          JSON.stringify({ error: "Preencha codinome, cidade e UF." }),
          { status: 400, headers }
        );
      }

      const db = await readState(store);
      const nextNumber = db.lastNumber + 1;
      const formattedNumber = padSequential(nextNumber);
      const now = new Date();

      const record = {
        number: nextNumber,
        formattedNumber,
        id: `METO-${formattedNumber}/${uf}`,
        codinome,
        cidade,
        uf,
        date: now.toLocaleDateString("pt-BR"),
        createdAt: now.toISOString(),
      };

      db.lastNumber = nextNumber;
      db.agents.unshift(record);
      await store.setJSON("registry", db);

      return new Response(
        JSON.stringify({
          credential: record,
          lastNumber: db.lastNumber,
          nextFormattedNumber: padSequential(db.lastNumber + 1),
          agents: db.agents,
        }),
        { status: 201, headers }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Fallback to local storage", details: String(err) }),
      { status: 503, headers }
    );
  }
};
