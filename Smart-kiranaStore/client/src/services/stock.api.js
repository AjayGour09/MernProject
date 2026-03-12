import { apiGet, apiPost } from "./api";
import { AuthService } from "./auth";

function shopId() {
  const shop = AuthService.getSelectedShop();
  if (!shop?._id) throw new Error("No shop selected");
  return shop._id;
}

export const StockAPI = {
  list: (search = "") =>
    apiGet(`/stock/products?shopId=${shopId()}&search=${encodeURIComponent(search)}`),

  low: () =>
    apiGet(`/stock/low?shopId=${shopId()}`),

  add: (body) =>
    apiPost(`/stock/products`, { ...body, shopId: shopId() }),

  update: (body) =>
    apiPost(`/stock/update`, { ...body, shopId: shopId() }),
};