import { apiGet, apiPost } from "./api";

export const StockAPI = {
  list: (search = "") => apiGet(`/stock/products?search=${encodeURIComponent(search)}`),
  low: () => apiGet("/stock/low"),
  add: (body) => apiPost("/stock/products", body),
  update: (body) => apiPost("/stock/update", body),

  // ✅ new
  logs: (productId) => apiGet(`/stock/logs/${productId}`),
  edit: (productId, body) =>
    fetch(`http://localhost:5000/api/stock/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }).then(async (r) => {
      if (!r.ok) throw new Error((await r.json())?.message || "Edit failed");
      return r.json();
    }),
  remove: (productId) =>
    fetch(`http://localhost:5000/api/stock/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (r) => {
      if (!r.ok) throw new Error((await r.json())?.message || "Delete failed");
      return r.json();
    }),

  summary: () => apiGet("/stock/summary"),
};