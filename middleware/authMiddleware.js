const jwt = require("jsonwebtoken");

// Authenticate JWT token
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded; // { id, role, name, email }
    next();
  });
};

// Authorize roles
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role.toLowerCase())) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
