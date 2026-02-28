const BASE_URL = "http://localhost:5000/api";

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.message || "Request failed";
  } catch {
    return await res.text();
  }
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}