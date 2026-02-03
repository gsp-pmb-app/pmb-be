import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.NGROK_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman / server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS policy: origin not allowed"), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`,
  );
  next();
});

// ================== DATABASE ==================
try {
  await db.authenticate();
  console.log("Database connection has been established successfully.");
  // NOTE: disabled automatic schema alter to avoid ALTER statements in dev
  // await db.sync({ alter: true });
  // console.log("Database synced.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// ================== ROUTES ==================
app.use("/api", router);
// global error handler (put before app.listen)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  return res
    .status(500)
    .json({ msg: "Register failed", error: err.message, stack: err.stack });
});

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
