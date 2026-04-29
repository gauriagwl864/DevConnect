const jwt = require("jsonwebtoken");

// reads token from Authorization header OR cookie (for EJS pages)
module.exports = (req, res, next) => {
  const token = req.headers.authorization || req.cookies.token;

  if (!token) return res.status(401).json({ error: "No token, please login" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
