import { Router } from "express";
import customerRoutes from "../routes/customer.routes.js";
import transactionRoutes from "../routes/transaction.routes.js";
import stockRoutes from "../routes/stock.routes.js";
import salesRoutes from "../routes/sales.routes.js";
import summaryRoutes from "../routes/summary.routes.js";
import authRoutes from "../routes/auth.routes.js"; // ✅ NEW

const router = Router();

router.use("/auth", authRoutes); // ✅ NEW
router.use("/customers", customerRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);
router.use("/sales", salesRoutes);
router.use("/summary", summaryRoutes);

export default router;