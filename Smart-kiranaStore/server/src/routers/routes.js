import { Router } from "express";
import customerRoutes from "./customer.routes.js";
import transactionRoutes from "./transaction.routes.js";
import stockRoutes from "./stock.routes.js";   // ✅ ADD THIS
import summaryRoutes from "./summary.routes.js";
import salesRoutes from "./sales.routes.js";

const router = Router();

router.get("/", (req, res) => res.json({ ok: true }));

router.use("/customers", customerRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);            // ✅ ADD 
router.use("/summary", summaryRoutes);
router.use("/sales", salesRoutes);

export default router;