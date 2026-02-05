import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🟡 authHeader:", authHeader);

  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];

  console.log("🟡 token:", token);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("🟢 decoded:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("🔴 jwt error:", err.message);
    return res.status(403).json({ msg: "Invalid token" });
  }
};

// ---- ROLE CHECKERS ----

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};

export const staffOnly = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ msg: "Staff only" });
  }
  next();
};

export const pendaftarOnly = (req, res, next) => {
  if (req.user.role !== "pendaftar") {
    return res.status(403).json({ msg: "Pendaftar only" });
  }
  next();
};

export const adminOrStaff = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ msg: "Admin or Staff only" });
  }
  next();
};
