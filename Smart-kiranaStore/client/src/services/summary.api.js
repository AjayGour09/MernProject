import { apiGet } from "./api";
import { AuthService } from "./auth";

export const SummaryAPI = {
  get: () => {
    const shop = AuthService.getSelectedShop();
    if (!shop?._id) throw new Error("No shop selected");
    return apiGet(`/summary?shopId=${shop._id}`);
  },
};