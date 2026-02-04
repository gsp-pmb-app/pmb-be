import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_URL =", process.env.DATABASE_URL);
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

export default db;
