import Shop from "../models/Shop.model.js";

export async function verifyShopOwner(shopId, ownerId) {
  const shop = await Shop.findOne({
    _id: shopId,
    ownerId,
  });

  if (!shop) {
    throw new Error("Unauthorized shop access");
  }

  return shop;
}