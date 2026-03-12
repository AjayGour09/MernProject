import { apiGet, apiPost } from "./api";

export const ShopAPI = {
  create: (body) => apiPost("/shops", body),
  list: () => apiGet("/shops"),
  get: (id) => apiGet(`/shops/${id}`),
};