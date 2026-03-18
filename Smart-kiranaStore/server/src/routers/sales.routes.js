import { Router } from "express";

import SaleDay from "../models/SaleDay.model.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { verifyShopOwner } from "../utils/shopOwner.js";

const router = Router();


// ===============================
// DATE HELPER
// ===============================
function todayStr() {
  const d = new Date();

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}


// ===============================
// TODAY SALES
// ===============================
router.get("/today", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({
        message: "shopId required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const date = todayStr();

    const doc = await SaleDay.findOne({
      shopId,
      date,
    });

    res.json(
      doc || {
        date,
        cash: 0,
        upi: 0,
        total: 0,
        note: "",
      }
    );
  } catch (e) {
    next(e);
  }
});


// ===============================
// SAVE DAY SALES
// ===============================
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const {
      shopId,
      date,
      cash = 0,
      upi = 0,
      note = "",
    } = req.body;

    if (!shopId || !date) {
      return res.status(400).json({
        message: "shopId & date required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const c = Number(cash);
    const u = Number(upi);

    if (!Number.isFinite(c) || c < 0) {
      return res.status(400).json({
        message: "cash must be >= 0",
      });
    }

    if (!Number.isFinite(u) || u < 0) {
      return res.status(400).json({
        message: "upi must be >= 0",
      });
    }

    const total = c + u;

    const doc = await SaleDay.findOneAndUpdate(
      {
        shopId,
        date,
      },
      {
        shopId,
        date,
        cash: c,
        upi: u,
        total,
        note: String(note).trim().slice(0, 120),
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(doc);
  } catch (e) {
    next(e);
  }
});


// ===============================
// SALES LIST
// ===============================
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({
        message: "shopId required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const limit = Number(req.query.limit || 7);

    const list = await SaleDay.find({
      shopId,
    })
      .sort({
        date: -1,
      })
      .limit(limit);

    res.json(list);
  } catch (e) {
    next(e);
  }
});


// ===============================
// MONTH SUMMARY
// ===============================
router.get("/month", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({
        message: "shopId required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const days = Number(req.query.days || 30);

    const from = new Date();
    from.setDate(from.getDate() - days + 1);

    const y = from.getFullYear();
    const m = String(from.getMonth() + 1).padStart(2, "0");
    const d = String(from.getDate()).padStart(2, "0");

    const fromStr = `${y}-${m}-${d}`;

    const rows = await SaleDay.find({
      shopId,
      date: {
        $gte: fromStr,
      },
    });

    const summary = rows.reduce(
      (acc, row) => {
        acc.cash += Number(row.cash || 0);
        acc.upi += Number(row.upi || 0);
        acc.total += Number(row.total || 0);
        return acc;
      },
      {
        cash: 0,
        upi: 0,
        total: 0,
      }
    );

    res.json(summary);
  } catch (e) {
    next(e);
  }
});

export default router;