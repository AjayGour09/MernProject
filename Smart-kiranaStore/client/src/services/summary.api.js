import { apiGet } from "./api";
import { AuthService } from "./auth";

export const SummaryAPI = {
  get: async (filters = {}) => {
    const shop = AuthService.getSelectedShop();

    if (!shop?._id) throw new Error("No shop selected");

    const query = new URLSearchParams({
      shopId: shop._id,
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
      ...(filters.type && filters.type !== "ALL" && { type: filters.type }),
    }).toString();

    return await apiGet(`/summary?${query}`);
  },
};