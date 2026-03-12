import { Router } from "express";
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

// today
router.get("/today", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;
    const date = todayStr();

    const doc = await SaleDay.findOne({ shopId, date });
    res.json(doc || { date, cash: 0, upi: 0, total: 0, note: "" });
  } catch (e) {
    next(e);
  }
});

// save day
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId, date, cash = 0, upi = 0, note = "" } = req.body;

    if (!shopId || !date) {
      return res.status(400).json({ message: "shopId & date required" });
    }

    const c = Number(cash);
    const u = Number(upi);
    const total = c + u;

    const doc = await SaleDay.findOneAndUpdate(
      { shopId, date },
      { shopId, date, cash: c, upi: u, total, note: String(note || "").slice(0, 120) },
      { new: true, upsert: true }
    );

    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// list
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;
    const limit = Number(req.query.limit || 7);

    const list = await SaleDay.find({ shopId })
      .sort({ date: -1 })
      .limit(limit);

    res.json(list);
  } catch (e) {
    next(e);
  }
});

// month / range summary
router.get("/month", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;
    const days = Number(req.query.days || 30);

    const from = new Date();
    from.setDate(from.getDate() - days + 1);

    const y = from.getFullYear();
    const m = String(from.getMonth() + 1).padStart(2, "0");
    const d = String(from.getDate()).padStart(2, "0");
    const fromStr = `${y}-${m}-${d}`;

    const rows = await SaleDay.find({
      shopId,
      date: { $gte: fromStr },
    });

    const summary = rows.reduce(
      (acc, row) => {
        acc.cash += Number(row.cash || 0);
        acc.upi += Number(row.upi || 0);
        acc.total += Number(row.total || 0);
        return acc;
      },
      { cash: 0, upi: 0, total: 0 }
    );

    res.json(summary);
  } catch (e) {
    next(e);
  }
});

export default router;