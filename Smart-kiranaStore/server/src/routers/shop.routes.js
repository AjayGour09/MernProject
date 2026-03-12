import { Router } from "express";
import Shop from "../models/Shop.model.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

// create shop
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopName, phone = "", address = "" } = req.body;

    if (!shopName || !String(shopName).trim()) {
      return res.status(400).json({ message: "shopName required" });
    }

    const cleanName = String(shopName).trim();

    const shopCode =
      cleanName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    const shop = await Shop.create({
      ownerId: req.user.id,
      shopName: cleanName,
      shopCode,
      phone: String(phone).trim(),
      address: String(address).trim(),
    });

    res.status(201).json(shop);
  } catch (e) {
    next(e);
  }
});

// list my shops
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const shops = await Shop.find({
      ownerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(shops);
  } catch (e) {
    next(e);
  }
});

// get one shop
router.get("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const shop = await Shop.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (e) {
    next(e);
  }
});

export default router;