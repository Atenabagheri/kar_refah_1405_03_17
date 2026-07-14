const convertPersianNumbersToEnglish = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
};

const normalizeNumbersMiddleware = (req, res, next) => {
  // تبدیل مقادیر درون body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = convertPersianNumbersToEnglish(req.body[key]);
      }
    });
  }

  // تبدیل مقادیر درون query
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = convertPersianNumbersToEnglish(req.query[key]);
      }
    });
  }

  // تبدیل مقادیر درون params
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      if (typeof req.params[key] === "string") {
        req.params[key] = convertPersianNumbersToEnglish(req.params[key]);
      }
    });
  }

  next();
};

module.exports = normalizeNumbersMiddleware;