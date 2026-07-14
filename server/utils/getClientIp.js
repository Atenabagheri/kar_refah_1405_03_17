function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] || // وقتی پشت پروکسی باشه
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
}

module.exports = getClientIp;
