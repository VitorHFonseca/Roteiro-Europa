export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY não configurada." });

    const body = req.body || {};
    const prompt = `
Você é um consultor de mochilão pela Europa.
Responda em português do Brasil.
O app agora tem veículos editáveis e sugestões do dia editáveis.
Modo: ${body.mode}
Pedido: ${body.question || "sem pedido"}
Roteiro: ${JSON.stringify(body.route || [], null, 2)}
Veículos: ${JSON.stringify(body.vehicles || [], null, 2)}

Retorne APENAS JSON válido:
{
  "title": "título curto",
  "cards": [
    {"title":"nome do bloco", "items":["dica prática 1","dica prática 2","dica prática 3"]}
  ]
}
`.trim();

    const openai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        input: prompt
      })
    });

    const data = await openai.json();
    if (!openai.ok) return res.status(openai.status).json({ error: data.error?.message || "Erro na OpenAI", raw: data });

    const text = data.output_text || data.output?.map(o => o.content?.map(c => c.text).join("")).join("") || "";
    try { return res.status(200).json(JSON.parse(text)); }
    catch { return res.status(200).json({ title: "Resposta da IA", answer: text }); }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
