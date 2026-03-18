import { Router } from "express";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.model.js";
import Customer from "../models/Customer.model.js";
import { ENV } from "../config/env.js";

import {
  adminRegisterSchema,
  adminLoginSchema,
  customerLoginSchema,
} from "../validators/auth.validator.js";

const router = Router();

function signToken(payload) {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
}

router.post("/admin/register", async (req, res, next) => {
  try {
    const parsed = adminRegisterSchema.parse(req.body);
    const { name, email, password } = parsed;

    const cleanEmail = email.trim().toLowerCase();

    const exists = await Admin.findOne({ email: cleanEmail });

    if (exists) {
      return res.status(409).json({
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      password,
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
    next(e);
  }
});

router.post("/admin/login", async (req, res, next) => {
  try {
    const parsed = adminLoginSchema.parse(req.body);
    const { email, password } = parsed;

    const cleanEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await admin.comparePassword(password);

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

router.post("/customer/login", async (req, res, next) => {
  try {
    const parsed = customerLoginSchema.parse(req.body);
    const { phone, password } = parsed;

    const customer = await Customer.findOne({ phone: phone.trim() });

    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!customer.password) {
      return res
        .status(400)
        .json({ message: "Password not set. Please set password first." });
    }

    const ok = await customer.comparePassword(password);

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

router.post("/customer/set-password", async (req, res) => {
  try {
    const { phone, password, confirmPassword } = req.body;

    if (!phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "phone, password, confirmPassword required" });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const customer = await Customer.findOne({ phone: String(phone).trim() });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.password = String(password);
    await customer.save();

    return res.json({ message: "Password set successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Set password failed" });
  }
});

export default router;