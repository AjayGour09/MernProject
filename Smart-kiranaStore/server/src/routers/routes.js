import { Router } from "express";
import customerRoutes from "./customer.routes.js";
import transactionRoutes from "./transaction.routes.js";
import stockRoutes from "./stock.routes.js";   // ✅ ADD THIS

const router = Router();

router.get("/", (req, res) => res.json({ ok: true }));

router.use("/customers", customerRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);            // ✅ ADD THIS

export default router;