import AuditLog from "../models/AuditLog.model.js";

export async function createAuditLog({
  userId,
  role,
  action,
  shopId = null,
  details = {},
}) {
  await AuditLog.create({
    userId,
    role,
    action,
    shopId,
    details,
  });
}