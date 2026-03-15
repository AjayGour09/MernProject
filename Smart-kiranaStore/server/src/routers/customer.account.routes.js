import { Router } from "express";
import ShopCustomer from "../models/ShopCustomer.model.js";
import Transaction from "../models/Transaction.model.js";
import { protect, customerOnly } from "../middlewares/auth.middleware.js";

const router = Router();

// list shops of logged in customer
router.get("/customer-shops", protect, customerOnly, async (req, res, next) => {
  try {
    const relations = await ShopCustomer.find({
      customerId: req.user.id,
    }).populate("shopId");

    const list = relations
      .filter((r) => r.shopId)
      .map((r) => ({
        shopId: r.shopId._id,
        shopName: r.shopId.shopName,
        balance: r.balance,
      }));

    res.json(list);
  } catch (e) {
    next(e);
  }
});

// customer account by selected shop
router.get("/customer-account", protect, customerOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "shopId required" });
    }

    const relation = await ShopCustomer.findOne({
      shopId,
      customerId: req.user.id,
    }).populate("shopId");

    if (!relation) {
      return res.status(404).json({ message: "Account not found" });
    }

    const ledger = await Transaction.find({
      shopId,
      customerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      shop: relation.shopId,
      balance: relation.balance,
      ledger,
    });
  } catch (e) {
    next(e);
  }
});

export default router;