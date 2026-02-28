export const log = {
  info: (...a) => console.log("ℹ️", ...a),
  warn: (...a) => console.warn("⚠️", ...a),
  error: (...a) => console.error("❌", ...a),
};