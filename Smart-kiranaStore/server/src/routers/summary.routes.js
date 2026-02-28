import { Router } from "express";
import Customer from "../models/Customer.model.js";
import Product from "../models/Product.model.js";

const router = Router();

// GET /api/summary
router.get("/", async (req, res, next) => {
  try {
    const totalCustomers = await Customer.countDocuments();

    const bakiAgg = await Customer.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    const totalBaki = bakiAgg[0]?.total || 0;

    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$qty", "$minStock"] },
    });

    res.json({
      totalCustomers,
      totalBaki,
      lowStockCount,
    });
  } catch (e) {
    next(e);
  }
});

export default router;