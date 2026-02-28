import { Router } from "express";
import SaleDay from "../models/SaleDay.model.js";
import { log } from "../utils/logger.js";

const router = Router();

// helper: today in YYYY-MM-DD (server local time)
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// GET /api/sales/today
router.get("/today", async (req, res, next) => {
  try {
    const date = todayStr();
    const doc = await SaleDay.findOne({ date });
    res.json(
      doc || { date, cash: 0, upi: 0, note: "", total: 0 }
    );
  } catch (e) {
    next(e);
  }
});

// POST /api/sales  (upsert by date)
router.post("/", async (req, res, next) => {
  try {
    const { date, cash = 0, upi = 0, note = "" } = req.body;

    log.info("POST /sales:", { date, cash, upi });

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Valid date required (YYYY-MM-DD)" });
    }

    const c = Number(cash);
    const u = Number(upi);
    if (!Number.isFinite(c) || c < 0) return res.status(400).json({ message: "Cash must be >= 0" });
    if (!Number.isFinite(u) || u < 0) return res.status(400).json({ message: "UPI must be >= 0" });

    const doc = await SaleDay.findOneAndUpdate(
      { date },
      { $set: { cash: c, upi: u, note: String(note || "").slice(0, 120) } },
      { new: true, upsert: true }
    );

    res.status(201).json({ ...doc.toObject(), total: doc.cash + doc.upi });
  } catch (e) {
    next(e);
  }
});

// GET /api/sales?limit=7
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 7), 60);
    const list = await SaleDay.find().sort({ date: -1 }).limit(limit);
    res.json(list.map((d) => ({ ...d.toObject(), total: d.cash + d.upi })));
  } catch (e) {
    next(e);
  }
});
// GET /api/sales/month?days=30
router.get("/month", async (req, res, next) => {
  try {
    const days = Math.min(Number(req.query.days || 30), 365);

    // last N dates (string compare works for YYYY-MM-DD)
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - (days - 1));

    const y = from.getFullYear();
    const m = String(from.getMonth() + 1).padStart(2, "0");
    const d = String(from.getDate()).padStart(2, "0");
    const fromDate = `${y}-${m}-${d}`;

    const agg = await SaleDay.aggregate([
      { $match: { date: { $gte: fromDate } } },
      { $group: { _id: null, cash: { $sum: "$cash" }, upi: { $sum: "$upi" } } },
    ]);

    const cash = agg[0]?.cash || 0;
    const upi = agg[0]?.upi || 0;

    res.json({ days, fromDate, cash, upi, total: cash + upi });
  } catch (e) {
    next(e);
  }
});

export default router;