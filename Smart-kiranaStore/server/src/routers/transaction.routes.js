import { Router } from "express";
import mongoose from "mongoose";

import Transaction from "../models/Transaction.model.js";
import ShopCustomer from "../models/ShopCustomer.model.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { verifyShopOwner } from "../utils/shopOwner.js";
import { createAuditLog } from "../utils/auditLog.js";

const router = Router();


// ===============================
// ADD TRANSACTION (ATOMIC + AUDIT)
// ===============================
router.post("/", protect, adminOnly, async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      shopId,
      customerId,
      type,
      amount,
      note = "",
      items = [],
    } = req.body;

    if (!shopId || !customerId || !type || amount === undefined) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "shopId, customerId, type, amount required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const amt = Number(amount);

    if (!Number.isFinite(amt) || amt <= 0) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    if (!["UDAAR", "PAYMENT"].includes(type)) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    const relation = await ShopCustomer.findOne({
      shopId,
      customerId,
    }).session(session);

    if (!relation) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Customer not linked to this shop",
      });
    }

    const cleanItems = Array.isArray(items)
      ? items.map((it) => ({
          name: String(it.name || "").trim(),
          qty: Number(it.qty || 0),
          price: Number(it.price || 0),
          total: Number(it.total || 0),
        }))
      : [];

    const tx = await Transaction.create(
      [
        {
          shopId,
          customerId,
          type,
          amount: amt,
          note: String(note).trim().slice(0, 120),
          items: cleanItems,
        },
      ],
      { session }
    );

    if (type === "UDAAR") {
      relation.balance += amt;
    } else {
      relation.balance -= amt;
    }

    await relation.save({ session });

    await session.commitTransaction();
    session.endSession();

    await createAuditLog({
      userId: req.user.id,
      role: req.user.role,
      action: "ADD_TRANSACTION",
      shopId,
      details: {
        customerId,
        type,
        amount: amt,
      },
    });

    res.status(201).json(tx[0]);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    next(e);
  }
});


// ===============================
// LIST CUSTOMER TRANSACTIONS
// ===============================
router.get("/:customerId", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({
        message: "shopId required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const list = await Transaction.find({
      shopId,
      customerId: req.params.customerId,
    }).sort({
      createdAt: -1,
    });

    res.json(list);
  } catch (e) {
    next(e);
  }
});

export default router;