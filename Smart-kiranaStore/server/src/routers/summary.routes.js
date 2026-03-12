import { Router } from "express";
import ShopCustomer from "../models/ShopCustomer.model.js";
import Product from "../models/Product.model.js";
import SaleDay from "../models/SaleDay.model.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    const totalCustomers = await ShopCustomer.countDocuments({ shopId });

    const bakiAgg = await ShopCustomer.aggregate([
      { $match: { shopId } },
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);

    const totalBaki = bakiAgg[0]?.total || 0;

    const lowStockCount = await Product.countDocuments({
      shopId,
      $expr: { $lte: ["$qty", "$minStock"] },
    });

    const date = todayStr();

    const todayDoc = await SaleDay.findOne({
      shopId,
      date,
    });

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