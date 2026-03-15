import { Router } from "express";

import authRoutes from "../routes/auth.routes.js";
import shopRoutes from "./shop.routes.js";
import customerRoutes from "./customer.routes.js";
import customerAccountRoutes from "./customer.account.routes.js";
import transactionRoutes from "./transaction.routes.js";
import salesRoutes from "./sales.routes.js";
import stockRoutes from "./stock.routes.js";
import summaryRoutes from "./summary.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/shops", shopRoutes);
router.use("/customers", customerRoutes);
router.use("/", customerAccountRoutes);
router.use("/transactions", transactionRoutes);
router.use("/sales", salesRoutes);
router.use("/stock", stockRoutes);
router.use("/summary", summaryRoutes);

export default router;