import { Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import Customer from "../models/Customer.model.js";
import { ENV } from "../config/env.js";

const router = Router();

function signToken(payload) {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
}

router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const exists = await Admin.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name: String(name).trim(),
      email: cleanEmail,
      password: String(password),
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Admin register failed" });
  }
});

router.post("/customer/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "name, phone, password required" });
    }

    const cleanPhone = String(phone).trim();

    const exists = await Customer.findOne({ phone: cleanPhone });
    if (exists) {
      return res.status(409).json({ message: "Customer already exists" });
    }

    const customer = await Customer.create({
      name: String(name).trim(),
      phone: cleanPhone,
      password: String(password),
    });

    return res.status(201).json({
      message: "Customer registered successfully",
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Customer register failed" });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
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
    return res.status(500).json({ message: e.message || "Admin login failed" });
  }
});

router.post("/customer/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "phone & password required" });
    }

    const customer = await Customer.findOne({ phone: String(phone).trim() });

    if (!customer) {
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
    return res.status(500).json({ message: e.message || "Customer login failed" });
  }
});

export default router;