import { Router } from "express";
import Transaction from "../models/Transaction.model.js";
import ShopCustomer from "../models/ShopCustomer.model.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { verifyShopOwner } from "../utils/shopOwner.js";

const router = Router();

// GET /summary
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId, from, to, type } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "shopId required" });
    }

    await verifyShopOwner(shopId, req.user.id);

    // date filter
    const dateFilter = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to) dateFilter.createdAt.$lte = new Date(to);
    }

    // type filter
    const typeFilter = {};
    if (type && type !== "ALL") {
      typeFilter.type = type;
    }

    const filter = {
      shopId,
      ...dateFilter,
      ...typeFilter,
    };

    // transactions
    const transactions = await Transaction.find(filter);

    // calculations
    let totalSales = 0;
    let totalPayment = 0;

    for (const tx of transactions) {
      if (tx.type === "UDHAAR") totalSales += tx.amount;
      if (tx.type === "PAYMENT") totalPayment += tx.amount;
    }

    const customers = await ShopCustomer.find({ shopId });

    const totalBaki = customers.reduce(
      (sum, c) => sum + Number(c.balance || 0),
      0
    );

    const lowStockCount = 0; // (we’ll upgrade later)

    res.json({
      totalCustomers: customers.length,
      totalBaki,
      totalSales,
      totalPayment,
      net: totalSales - totalPayment,
      transactionCount: transactions.length,
    });
  } catch (e) {
    next(e);
  }
});

export default router;