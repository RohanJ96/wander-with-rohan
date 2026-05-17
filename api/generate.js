// Vercel serverless function — talks to Anthropic, hides the API key.
// Vercel automatically serves this at /api/generate
// maxDuration tells Vercel to allow up to 60 seconds (the free-tier limit).

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  const log = (msg) => console.log(`[generate] ${msg}`);
  log("Function invoked");

  if (req.method !== "POST") {
    log("Rejected: not a POST request");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    log("ERROR: ANTHROPIC_API_KEY is missing");
    return res.status(500).json({
      error: "API key not configured. Set ANTHROPIC_API_KEY in Vercel environment variables.",
    });
  }
  log(`API key present (starts with ${apiKey.slice(0, 7)}...)`);

  // Vercel parses JSON body automatically, but handle both cases safely
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      log(`ERROR parsing request body: ${e.message}`);
      return res.status(400).json({ error: "Invalid request body" });
    }
  }
  log(`Request parsed. Model: ${body?.model}, max_tokens: ${body?.max_tokens}`);

  try {
    log("Calling Anthropic API...");
    const startTime = Date.now();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const elapsed = Date.now() - startTime;
    log(`Anthropic responded in ${elapsed}ms with status ${response.status}`);

    const data = await response.json();
    log(`Response body parsed. Has content: ${!!data.content}`);

    if (data.error) {
      log(`Anthropic returned an error: ${JSON.stringify(data.error)}`);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    log(`CAUGHT ERROR: name=${error.name}, message=${error.message}`);
    return res.status(500).json({ error: error.message });
  }
}
