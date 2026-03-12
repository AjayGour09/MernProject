import { Router } from "express";
import Transaction from "../models/Transaction.model.js";
import ShopCustomer from "../models/ShopCustomer.model.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

// add transaction
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const {
      shopId,
      customerId,
      type,
      amount,
      note = "",
      items = [],
    } = req.body;

    if (!shopId || !customerId || !type || !amount) {
      return res.status(400).json({
        message: "shopId, customerId, type, amount required",
      });
    }

    const amt = Number(amount);

    const relation = await ShopCustomer.findOne({
      shopId,
      customerId,
    });

    if (!relation) {
      return res.status(404).json({ message: "Customer not linked to shop" });
    }

    const tx = await Transaction.create({
      shopId,
      customerId,
      type,
      amount: amt,
      note,
      items,
    });

    if (type === "UDAAR") {
      relation.balance += amt;
    } else {
      relation.balance -= amt;
    }

    await relation.save();

    res.status(201).json(tx);
  } catch (e) {
    next(e);
  }
});

// list customer transactions by shop
router.get("/:customerId", protect, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    const list = await Transaction.find({
      shopId,
      customerId: req.params.customerId,
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (e) {
    next(e);
  }
});

export default router;