import { Router } from "express";
import authRoutes from "../routes/auth.routes.js";
import shopRoutes from "./shop.routes.js";
import customerRoutes from "./customer.routes.js";
import transactionRoutes from "./transaction.routes.js";
import stockRoutes from "./stock.routes.js";
import salesRoutes from "./sales.routes.js";
import summaryRoutes from "./summary.routes.js";
import customerPortalRoutes from "./customerPortal.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/shops", shopRoutes);
router.use("/", customerPortalRoutes);
router.use("/customers", customerRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);
router.use("/sales", salesRoutes);
router.use("/summary", summaryRoutes);

export default router;