import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import StockLog from "../models/StockLog.model.js";
import { log } from "../utils/logger.js";

const router = Router();

/* ------------------------- Helpers ------------------------- */
function toNum(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

/* ------------------------- Add product ------------------------- */
router.post("/products", async (req, res, next) => {
  try {
    const { name, unit = "pcs", qty = 0, minStock = 0, category = "", barcode = "" } = req.body;

    log.info("POST /stock/products:", { name, unit, qty, minStock, category, barcode });

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Product name required" });
    }

    const q = toNum(qty, 0);
    const ms = toNum(minStock, 0);

    if (q < 0) return res.status(400).json({ message: "qty must be >= 0" });
    if (ms < 0) return res.status(400).json({ message: "minStock must be >= 0" });

    const product = await Product.create({
      name: String(name).trim(),
      unit: String(unit || "pcs").trim(),
      qty: q,
      minStock: ms,
      category: String(category || "").trim(),
      barcode: String(barcode || "").trim(),
    });

    return res.status(201).json(product);
  } catch (e) {
    log.error("POST /stock/products error:", e?.message);
    next(e);
  }
});

/* ------------------------- List + search ------------------------- */
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

/* ------------------------- Low stock ------------------------- */
router.get("/low", async (req, res, next) => {
  try {
    const items = await Product.find({
      $expr: { $lte: ["$qty", "$minStock"] },
    }).sort({ qty: 1 });
    return res.json(items);
  } catch (e) {
    next(e);
  }
});

/* ------------------------- Stock summary (optional) ------------------------- */
router.get("/summary", async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$qty", "$minStock"] },
    });

    const qtyAgg = await Product.aggregate([
      { $group: { _id: null, totalQty: { $sum: "$qty" } } },
    ]);

    return res.json({
      totalProducts,
      lowStockCount,
      totalQty: qtyAgg[0]?.totalQty || 0,
    });
  } catch (e) {
    next(e);
  }
});

/* ------------------------- Update stock (+/-) ------------------------- */
router.post("/update", async (req, res, next) => {
  try {
    const { productId, change, reason = "" } = req.body;
    log.info("POST /stock/update:", { productId, change });

    if (!mongoose.isValidObjectId(productId)) {
      log.warn("Invalid productId:", productId);
      return res.status(400).json({ message: "Invalid productId" });
    }

    const ch = toNum(change, 0);
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

/* ------------------------- Logs ------------------------- */
router.get("/logs/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const logs = await StockLog.find({ productId })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json(logs);
  } catch (e) {
    next(e);
  }
});

/* ------------------------- Edit product (name/unit/minStock/category/barcode) ------------------------- */
router.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, unit, minStock, category = "", barcode = "" } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const patch = {};

    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ message: "name required" });
      patch.name = String(name).trim();
    }
    if (unit !== undefined) patch.unit = String(unit || "pcs").trim();
    if (minStock !== undefined) {
      const ms = toNum(minStock, 0);
      if (ms < 0) return res.status(400).json({ message: "minStock must be >= 0" });
      patch.minStock = ms;
    }

    patch.category = String(category || "").trim();
    patch.barcode = String(barcode || "").trim();

    const updated = await Product.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    return res.json(updated);
  } catch (e) {
    next(e);
  }
});

/* ------------------------- Delete product ------------------------- */
router.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    // optional: delete logs (clean)
    await StockLog.deleteMany({ productId: id });

    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;