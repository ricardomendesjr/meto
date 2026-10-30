import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

export const prerender = false;

interface AgentRecord {
  number: number;
  formattedNumber: string;
  id: string;
  codinome: string;
  cidade: string;
  uf: string;
  date: string;
  createdAt: string;
}

interface AgentsDatabase {
  lastNumber: number;
  agents: AgentRecord[];
}

const DB_PATH = path.resolve(process.cwd(), "data", "agentes.json");

async function readDb(): Promise<AgentsDatabase> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as AgentsDatabase;
    return {
      lastNumber: typeof parsed.lastNumber === "number" ? parsed.lastNumber : 0,
      agents: Array.isArray(parsed.agents) ? parsed.agents : [],
    };
  } catch {
    return { lastNumber: 0, agents: [] };
  }
}

async function writeDb(db: AgentsDatabase): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function padSequential(num: number): string {
  return String(num).padStart(4, "0");
}

export const GET: APIRoute = async () => {
  const db = await readDb();
  return new Response(
    JSON.stringify({
      lastNumber: db.lastNumber,
      nextFormattedNumber: padSequential(db.lastNumber + 1),
      agents: db.agents,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const codinome = String(body.codinome || "").trim().slice(0, 36);
    const cidade = String(body.cidade || "").trim().slice(0, 40);
    const uf = String(body.uf || "").trim().toUpperCase().slice(0, 2);

    if (!codinome || !cidade || !uf) {
      return new Response(
        JSON.stringify({ error: "Preencha codinome, cidade e UF." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = await readDb();
    const nextNumber = db.lastNumber + 1;
    const formattedNumber = padSequential(nextNumber);
    const now = new Date();

    const record: AgentRecord = {
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
    await writeDb(db);

    return new Response(
      JSON.stringify({
        credential: record,
        lastNumber: db.lastNumber,
        nextFormattedNumber: padSequential(db.lastNumber + 1),
        agents: db.agents,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Falha ao gerar número sequencial." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
