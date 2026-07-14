const Log = require("../log/models/logModel");

async function logActivity(req, action, status = "success", details = {}) {
  try {
    const employee =
      action === "login" && status === "success"
        ? details.nationalId
        : req.employee
        ? req.employee.nationalId
        : null;
    await Log.create({
      employee: employee,
      action,
      status,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      details,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

module.exports = logActivity;
