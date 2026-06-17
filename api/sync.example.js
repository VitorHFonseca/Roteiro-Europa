// EXEMPLO de endpoint de sync.
// Este exemplo usa memória temporária e NÃO serve para produção.
// Para produção, conecte aqui um banco como Supabase, Firebase Admin, Neon ou Vercel KV.

const memory = globalThis.__ROTEIRO_SYNC__ || (globalThis.__ROTEIRO_SYNC__ = {});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { user, state } = req.body || {};
    if (!user || !state) return res.status(400).json({ error: "Envie user e state." });
    memory[user] = { state, updatedAt: new Date().toISOString() };
    return res.status(200).json({ ok: true, updatedAt: memory[user].updatedAt });
  }

  if (req.method === "GET") {
    const user = req.query.user;
    if (!user || !memory[user]) return res.status(404).json({ error: "Não encontrado." });
    return res.status(200).json(memory[user]);
  }

  return res.status(405).json({ error: "Método não permitido." });
}
