import { Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import Customer from "../models/Customer.model.js";
import { ENV } from "../config/env.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

function signToken(payload) {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
}

/**
 * ✅ Bootstrap admin
 * First time ek admin create karne ke liye.
 * Later is route ko remove/secure kar sakte ho.
 */
router.post("/setup-admin", async (req, res, next) => {
  try {
    const { name = "Admin", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const exists = await Admin.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * ✅ Admin login
 */
router.post("/admin/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const admin = await Admin.findOne({
      email: String(email).trim().toLowerCase(),
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await admin.comparePassword(String(password));
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: admin._id,
      role: "admin",
      name: admin.name,
      email: admin.email,
    });

    return res.json({
      token,
      user: {
        id: admin._id,
        role: "admin",
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * ✅ Customer login
 * login by phone + password
 */
router.post("/customer/login", async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "phone & password required" });
    }

    const customer = await Customer.findOne({
      phone: String(phone).trim(),
    });

    if (!customer || !customer.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await customer.comparePassword(String(password));
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: customer._id,
      role: "customer",
      name: customer.name,
      phone: customer.phone,
    });

    return res.json({
      token,
      user: {
        id: customer._id,
        role: "customer",
        name: customer.name,
        phone: customer.phone,
      },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * ✅ Check current logged-in user
 */
router.get("/me", protect, async (req, res, next) => {
  try {
    return res.json({
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

export default router;