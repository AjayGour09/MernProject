import { apiGet, apiPost } from "./api";

export const StockAPI = {
  list: (search = "") => apiGet(`/stock/products?search=${encodeURIComponent(search)}`),
  low: () => apiGet("/stock/low"),
  add: (body) => apiPost("/stock/products", body),
  update: (body) => apiPost("/stock/update", body),
};