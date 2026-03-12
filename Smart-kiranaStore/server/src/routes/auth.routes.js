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

router.post("/setup-admin", async (req, res) => {
  try {
    const { name = "Admin", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const exists = await Admin.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name: String(name).trim() || "Admin",
      email: cleanEmail,
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
    console.log("❌ SETUP ADMIN ERROR:", e);
    return res.status(500).json({ message: e.message || "Setup failed" });
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
    console.log("❌ ADMIN LOGIN ERROR:", e);
    return res.status(500).json({ message: e.message || "Login failed" });
  }
});

router.post("/customer/set-password", async (req, res) => {
  try {
    const { phone, password, confirmPassword } = req.body;

    if (!phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "phone, password, confirmPassword required" });
    }

    if (String(password).trim().length < 4) {
      return res.status(400).json({ message: "Password at least 4 chars" });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const customer = await Customer.findOne({ phone: String(phone).trim() });
    if (!customer || !customer.isActive) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.password = String(password);
    await customer.save();

    return res.json({ message: "Password set successfully" });
  } catch (e) {
    console.log("❌ CUSTOMER SET PASSWORD ERROR:", e);
    return res.status(500).json({ message: e.message || "Set password failed" });
  }
});

router.post("/customer/login", async (req, res) => {
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
    console.log("❌ CUSTOMER LOGIN ERROR:", e);
    return res.status(500).json({ message: e.message || "Login failed" });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Failed" });
  }
});

export default router;