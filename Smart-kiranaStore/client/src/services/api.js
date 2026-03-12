const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("smart_kirana_token") || "";
}

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.message || "Request failed";
  } catch {
    return await res.text();
  }
}

export async function apiGet(path) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiPost(path, body) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}