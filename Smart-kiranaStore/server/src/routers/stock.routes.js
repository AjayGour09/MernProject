import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import StockLog from "../models/StockLog.model.js";
import { log } from "../utils/logger.js";

const router = Router();

// Add product
router.post("/products", async (req, res, next) => {
  try {
    const { name, unit = "pcs", qty = 0, minStock = 0 } = req.body;

    log.info("POST /stock/products:", { name, unit, qty, minStock });

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Product name required" });
    }

    const q = Number(qty);
    const ms = Number(minStock);

    if (!Number.isFinite(q) || q < 0) return res.status(400).json({ message: "qty must be >= 0" });
    if (!Number.isFinite(ms) || ms < 0) return res.status(400).json({ message: "minStock must be >= 0" });

    const product = await Product.create({
      name: String(name).trim(),
      unit: String(unit || "pcs").trim(),
      qty: q,
      minStock: ms,
    });

    return res.status(201).json(product);
  } catch (e) {
    log.error("POST /stock/products error:", e?.message);
    next(e);
  }
});

// List products + search
router.get("/products", async (req, res, next) => {
  try {
    const q = (req.query.search || "").trim();
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const items = await Product.find(filter).sort({ updatedAt: -1 });
    return res.json(items);
  } catch (e) {
    next(e);
  }
});

// Low stock products (qty <= minStock)
router.get("/low", async (req, res, next) => {
  try {
    const items = await Product.find({ $expr: { $lte: ["$qty", "$minStock"] } }).sort({ qty: 1 });
    return res.json(items);
  } catch (e) {
    next(e);
  }
});

// Update stock by change (+/-)
router.post("/update", async (req, res, next) => {
  try {
    const { productId, change, reason = "" } = req.body;
    log.info("POST /stock/update:", { productId, change });

    if (!mongoose.isValidObjectId(productId)) {
      log.warn("Invalid productId:", productId);
      return res.status(400).json({ message: "Invalid productId" });
    }

    const ch = Number(change);
    if (!Number.isFinite(ch) || ch === 0) {
      return res.status(400).json({ message: "change must be a non-zero number" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newQty = product.qty + ch;
    if (newQty < 0) {
      log.warn("Stock cannot go negative", { current: product.qty, change: ch });
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    product.qty = newQty;
    await product.save();

    await StockLog.create({
      productId,
      change: ch,
      reason: String(reason || "").slice(0, 80),
    });

    return res.json(product);
  } catch (e) {
    log.error("POST /stock/update error:", e?.message);
    next(e);
  }
});

export default router;