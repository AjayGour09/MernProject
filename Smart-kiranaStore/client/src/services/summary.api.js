import { apiGet } from "./api";

export const SummaryAPI = {
  get: () => apiGet("/summary"),
};