// import { Sequelize } from "sequelize";

// const db = new Sequelize(
//   process.env.DB_NAME || "pmb_db",
//   process.env.DB_USER || "root",
//   process.env.DB_PASS || "",
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "mysql",
//     logging: false,
//   },
// );

// export default db;

// PRODUCTION

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_URL =", process.env.DATABASE_URL);
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

export default db;
