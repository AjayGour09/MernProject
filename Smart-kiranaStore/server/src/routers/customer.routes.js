import { Router } from "express";
import Customer from "../models/Customer.model.js";

const router = Router();

// add customer
router.post("/", async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ message: "name & phone required" });

    const exists = await Customer.findOne({ phone });
    if (exists) return res.status(409).json({ message: "Phone already exists" });

    const customer = await Customer.create({ name, phone });
    res.status(201).json(customer);
  } catch (e) {
    next(e);
  }
});

// list customers + search
router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.search || "").trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.json(customers);
  } catch (e) {
    next(e);
  }
});

export default router;