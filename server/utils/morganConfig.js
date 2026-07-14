import morgan from "morgan";

const colors = {
  GET: "\x1b[32m",
  POST: "\x1b[34m",
  PUT: "\x1b[33m",
  PATCH: "\x1b[38;5;208m",
  DELETE: "\x1b[31m",
  RESET: "\x1b[0m",
};

morgan.token("colored-method", (req) => {
  const method = req.method;
  const color = colors[method] || colors.RESET;
  return `${color}${method}${colors.RESET}`;
});

morgan.token("colored-status", (_req, res) => {
  const status = res.statusCode;
  let color = "\x1b[32m";

  if (status >= 500) color = "\x1b[35m"; // بنفش
  else if (status >= 400) color = "\x1b[31m"; // قرمز
  else if (status >= 300) color = "\x1b[33m"; // زرد

  return `${color}${status}\x1b[0m`;
});

export const morganFormat =
  "[:date[iso]] :colored-method :url :colored-status :response-time ms - :res[content-length]";
