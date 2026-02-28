import { Router } from "express";
import mongoose from "mongoose";
import Customer from "../models/Customer.model.js";
import Transaction from "../models/Transaction.model.js";
import { log } from "../utils/logger.js";

const router = Router();

/**
 * POST /api/transactions
 * body: { customerId, type: "UDAAR"|"PAYMENT", amount, note? }
 */
router.post("/", async (req, res, next) => {
  try {
    const { customerId, type, amount, note = "" } = req.body;

    // logs (helpful for debugging)
    log.info("POST /transactions payload:", { customerId, type, amount });

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

    // Create transaction
    const tx = await Transaction.create({
      customerId,
      type,
      amount: amt,
      note: String(note || "").slice(0, 80),
    });

    // Update balance
    if (type === "UDAAR") customer.balance += amt;
    else customer.balance -= amt;

    // optional: avoid negative balance (comment out if you allow)
    if (customer.balance < 0) {
      log.warn("Balance going negative, blocking. Current:", customer.balance);
      // rollback created tx
      await Transaction.findByIdAndDelete(tx._id);
      return res.status(400).json({ message: "Payment cannot be more than baki" });
    }

    await customer.save();

    log.info("Transaction saved:", tx._id, "New balance:", customer.balance);

    return res.status(201).json({
      transaction: tx,
      customer: { _id: customer._id, name: customer.name, phone: customer.phone, balance: customer.balance },
    });
  } catch (e) {
    log.error("POST /transactions error:", e?.message);
    next(e);
  }
});

/**
 * GET /api/transactions/:customerId
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