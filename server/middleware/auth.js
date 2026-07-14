const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    //check ac token
    let token =
      req.headers.authorization?.split(" ")[1] ||
      req.headers.Authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "لطفا وارد شوید!" });

    //validate
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, employee) => {
      if (err) return res.status(401).json({ message: "لطفا وارد شوید!" });
      req.employee = employee;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = auth;
