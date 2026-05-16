// Netlify serverless function — talks to Anthropic, hides the API key.
// This version is INSTRUMENTED with logging so we can see exactly where
// it hangs if a request fails.

export async function handler(event) {
  const log = (msg) => console.log(`[generate] ${msg}`);

  log("Function invoked");

  if (event.httpMethod !== "POST") {
    log("Rejected: not a POST request");
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    log("ERROR: ANTHROPIC_API_KEY is missing");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API key not configured. Set ANTHROPIC_API_KEY in Netlify environment variables.",
      }),
    };
  }
  log(`API key present (starts with ${apiKey.slice(0, 7)}...)`);

  let body;
  try {
    body = JSON.parse(event.body);
    log(`Request parsed. Model: ${body.model}, max_tokens: ${body.max_tokens}`);
  } catch (e) {
    log(`ERROR parsing request body: ${e.message}`);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    log("ABORTING: Anthropic call exceeded 25 seconds");
    controller.abort();
  }, 25000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;
    log(`Anthropic responded in ${elapsed}ms with status ${response.status}`);

    const data = await response.json();
    log(`Response body parsed. Has content: ${!!data.content}`);

    if (data.error) {
      log(`Anthropic returned an error: ${JSON.stringify(data.error)}`);
    }

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    log(`CAUGHT ERROR: name=${error.name}, message=${error.message}`);

    if (error.name === "AbortError") {
      return {
        statusCode: 504,
        body: JSON.stringify({
          error: "The AI took too long to respond (over 25 seconds). This is a known limit we're fixing.",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
