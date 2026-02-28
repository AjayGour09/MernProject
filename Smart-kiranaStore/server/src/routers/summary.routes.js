import { Router } from "express";
import Customer from "../models/Customer.model.js";
import Product from "../models/Product.model.js";
import SaleDay from "../models/SaleDay.model.js";

const router = Router();

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

    const date = todayStr();
    const todayDoc = await SaleDay.findOne({ date });
    const todaySales = (todayDoc?.cash || 0) + (todayDoc?.upi || 0);

    res.json({
      totalCustomers,
      totalBaki,
      lowStockCount,
      todaySales,
      todayDate: date,
    });
  } catch (e) {
    next(e);
  }
});

export default router;