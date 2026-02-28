import { apiGet, apiPost } from "./api";

export const SalesAPI = {
  today: () => apiGet("/sales/today"),
  save: (body) => apiPost("/sales", body),
  list: (limit = 7) => apiGet(`/sales?limit=${limit}`),
  month: (days = 30) => apiGet(`/sales/month?days=${days}`),
};