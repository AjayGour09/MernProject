import { Router } from "express";
import mongoose from "mongoose";

import Product from "../models/Product.model.js";
import StockLog from "../models/StockLog.model.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { verifyShopOwner } from "../utils/shopOwner.js";
import { createAuditLog } from "../utils/auditLog.js";

const router = Router();


// ===============================
// ADD PRODUCT
// ===============================
router.post("/products", protect, adminOnly, async (req, res, next) => {
  try {
    const {
      shopId,
      name,
      unit = "pcs",
      qty = 0,
      minStock = 0,
    } = req.body;

    if (!shopId || !name) {
      return res.status(400).json({
        message: "shopId & name required",
      });
    }

    await verifyShopOwner(shopId, req.user.id);

    const product = await Product.create({
      shopId,
      name: String(name).trim(),
      unit: String(unit).trim(),
      qty: Number(qty),
      minStock: Number(minStock),
    });

    await createAuditLog({
      userId: req.user.id,
      role: req.user.role,
      action: "ADD_PRODUCT",
      shopId,
      details: {
        productId: product._id,
        name: product.name,
      },
    });

    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});


// ===============================
// LIST PRODUCTS
// ===============================
router.get("/products", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId, search = "" } = req.query;

    await verifyShopOwner(shopId, req.user.id);

    const filter = {
      shopId,
      ...(search
        ? {
            name: {
              $regex: search,
              $options: "i",
            },
          }
        : {}),
    };

    const items = await Product.find(filter).sort({
      updatedAt: -1,
    });

    res.json(items);
  } catch (e) {
    next(e);
  }
});


// ===============================
// LOW STOCK
// ===============================
router.get("/low", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    await verifyShopOwner(shopId, req.user.id);

    const items = await Product.find({
      shopId,
      $expr: {
        $lte: ["$qty", "$minStock"],
      },
    }).sort({
      qty: 1,
    });

    res.json(items);
  } catch (e) {
    next(e);
  }
});


// ===============================
// UPDATE STOCK
// ===============================
router.post("/update", protect, adminOnly, async (req, res, next) => {
  try {
    const {
      shopId,
      productId,
      change,
      reason = "",
    } = req.body;

    await verifyShopOwner(shopId, req.user.id);

    const product = await Product.findOne({
      _id: productId,
      shopId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const ch = Number(change);
    const newQty = Number(product.qty || 0) + ch;

    if (newQty < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    product.qty = newQty;
    await product.save();

    await StockLog.create({
      productId,
      change: ch,
      reason: String(reason).trim(),
    });

    await createAuditLog({
      userId: req.user.id,
      role: req.user.role,
      action: "UPDATE_STOCK",
      shopId,
      details: {
        productId,
        change: ch,
      },
    });

    res.json(product);
  } catch (e) {
    next(e);
  }
});

export default router;