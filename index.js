import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cors from "cors";
import dotenv from "dotenv";
import FileUpload from "express-fileupload";

dotenv.config();
const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;
const FE_URL = process.env.FE_URL || "https://gsp-pmb.netlify.app";

const allowedOrigins = [
  process.env.NGROK_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://localhost:5173",
  FE_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS policy: origin not allowed"), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use(
  FileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    abortOnLimit: true,
    createParentPath: true,
  }),
);
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`,
  );
  next();
});

/* ================== DATABASE ================== */
const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Database connected");

    await db.sync();
    console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

/* ================== ROUTES ================== */
app.use("/api", router);

/* ================== GLOBAL ERROR HANDLER ================== */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
  return res.status(500).json({
    msg: err.message || "Internal Server Error",
  });
});
