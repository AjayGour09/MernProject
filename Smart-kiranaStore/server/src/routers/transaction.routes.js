import { Router } from "express";
import mongoose from "mongoose";
import Customer from "../models/Customer.model.js";
import Transaction from "../models/Transaction.model.js";
import { log } from "../utils/logger.js";

const router = Router();

/**
 * POST /api/transactions
 * body:
 * {
 *   customerId,
 *   type: "UDAAR" | "PAYMENT",
 *   amount,
 *   note?,
 *   items?: [{ name, qty, price, total }]
 * }
 */
router.post("/", async (req, res, next) => {
  try {
    const { customerId, type, amount, note = "", items = [] } = req.body;

    log.info("POST /transactions payload:", {
      customerId,
      type,
      amount,
      itemsCount: Array.isArray(items) ? items.length : "invalid",
    });

    if (!mongoose.isValidObjectId(customerId)) {
      log.warn("Invalid customerId:", customerId);
      return res.status(400).json({ message: "Invalid customerId" });
    }

    if (!["UDAAR", "PAYMENT"].includes(type)) {
      log.warn("Invalid type:", type);
      return res.status(400).json({ message: "Invalid type" });
    }

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      log.warn("Invalid amount:", amount);
      return res.status(400).json({ message: "Amount must be > 0" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      log.warn("Customer not found:", customerId);
      return res.status(404).json({ message: "Customer not found" });
    }

    // ✅ Validate items only for UDAAR (PAYMENT me normally items nahi hote)
    let cleanItems = [];
    if (type === "UDAAR") {
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }

      cleanItems = items
        .map((it) => ({
          name: String(it?.name || "").trim(),
          qty: Number(it?.qty),
          price: Number(it?.price),
          total: Number(it?.total),
        }))
        .filter((it) => it.name && Number.isFinite(it.qty) && it.qty > 0);

      // Recalculate totals safely
      cleanItems = cleanItems.map((it) => {
        const price = Number.isFinite(it.price) && it.price >= 0 ? it.price : 0;
        const total = it.qty * price;
        return { ...it, price, total };
      });
    }

    // ✅ Create transaction
    const tx = await Transaction.create({
      customerId,
      type,
      amount: amt,
      note: String(note || "").slice(0, 80),
      items: cleanItems,
    });

    // ✅ Update balance
    if (type === "UDAAR") customer.balance += amt;
    else customer.balance -= amt;

    // optional: block negative balance
    if (customer.balance < 0) {
      log.warn("Balance going negative, blocking. New balance:", customer.balance);
      await Transaction.findByIdAndDelete(tx._id);
      return res.status(400).json({ message: "Payment cannot be more than baki" });
    }

    await customer.save();

    log.info("Transaction saved:", tx._id, "New balance:", customer.balance);

    return res.status(201).json({
      transaction: tx,
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        balance: customer.balance,
      },
    });
  } catch (e) {
    log.error("POST /transactions error:", e?.message);
    next(e);
  }
});

/**
 * GET /api/transactions/:customerId
 * Returns last 30 entries
 */
router.get("/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.isValidObjectId(customerId)) {
      log.warn("Invalid customerId in params:", customerId);
      return res.status(400).json({ message: "Invalid customerId" });
    }

    const list = await Transaction.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json(list);
  } catch (e) {
    log.error("GET /transactions/:customerId error:", e?.message);
    next(e);
  }
});

export default router;