import { Router } from "express";
import Customer from "../models/Customer.model.js";
import ShopCustomer from "../models/ShopCustomer.model.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

// add customer to shop
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId, name, phone } = req.body;

    if (!shopId || !name || !phone) {
      return res.status(400).json({ message: "shopId, name, phone required" });
    }

    const cleanPhone = String(phone).trim();

    let customer = await Customer.findOne({ phone: cleanPhone });

    if (!customer) {
      customer = await Customer.create({
        name: String(name).trim(),
        phone: cleanPhone,
      });
    }

    const exists = await ShopCustomer.findOne({
      shopId,
      customerId: customer._id,
    });

    if (exists) {
      return res.status(409).json({ message: "Customer already linked to shop" });
    }

    const relation = await ShopCustomer.create({
      shopId,
      customerId: customer._id,
      balance: 0,
    });

    res.status(201).json({ customer, relation });
  } catch (e) {
    next(e);
  }
});

// list customers by shop
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId, search = "" } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "shopId required" });
    }

    const relations = await ShopCustomer.find({ shopId })
      .populate({
        path: "customerId",
        match: search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
              ],
            }
          : {},
      })
      .sort({ createdAt: -1 });

    const list = relations
      .filter((r) => r.customerId)
      .map((r) => ({
        _id: r.customerId._id,
        name: r.customerId.name,
        phone: r.customerId.phone,
        balance: r.balance,
      }));

    res.json(list);
  } catch (e) {
    next(e);
  }
});

// single customer with shop balance
router.get("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "shopId required" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const relation = await ShopCustomer.findOne({
      shopId,
      customerId: req.params.id,
    });

    if (!relation) {
      return res.status(404).json({ message: "Customer not linked to this shop" });
    }

    res.json({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      balance: relation.balance,
    });
  } catch (e) {
    next(e);
  }
});

export default router;