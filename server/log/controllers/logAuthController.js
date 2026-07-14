const getClientIp = require("../../utils/getClientIp");
const LogAuth = require("../models/logAuthModel");

exports.logAuthActivity = async (
  req,
  action,
  status = "success",
  details = {}
) => {
  try {
    const employee =
      details.nationalId || (req.employee ? req.employee.nationalId : null);

    console.log(employee);

    await LogAuth.create({
      employee: employee,
      action,
      status,
      ip: getClientIp(req),
      userAgent: req.get("User-Agent"),
      details,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

exports.getLogsAuth = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    const skip = (page - 1) * limit;

    const { search, employee, action, status } = req.query;

    const query = {};
    if (employee) query.employee = employee;
    if (action) query.action = action;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { employee: { $regex: search, $options: "i" } },
        { ip: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await LogAuth.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalLogsAuth = await LogAuth.countDocuments(query);

    const data = {
      data: logs,
      total: totalLogsAuth,
      totalPages: Math.ceil(totalLogsAuth / limit),
      currentPage: page,
    };

    res.json(data);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
