import { apiGet, apiPost } from "./api";
import { AuthService } from "./auth";

function shopId() {
  const shop = AuthService.getSelectedShop();
  if (!shop?._id) throw new Error("No shop selected");
  return shop._id;
}

export const SalesAPI = {
  today: () => apiGet(`/sales/today?shopId=${shopId()}`),

  save: (body) => apiPost(`/sales`, { ...body, shopId: shopId() }),

  list: (limit = 7) => apiGet(`/sales?shopId=${shopId()}&limit=${limit}`),

  month: (days = 30) => apiGet(`/sales/month?shopId=${shopId()}&days=${days}`),
};