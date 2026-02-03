import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ================== USER (ADMIN / STAFF) ================== */

export const registerUser = async (req, res) => {
  const { username, name, role, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Password not match" });

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username,
      name,
      role,
      password: hashPassword,
      is_active: true,
    });
    res.json({ msg: "Register User Successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Username already exists" });
  }
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({
    where: { username: req.body.username },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" },
  );

  res.json({ accessToken, role: user.role });
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "name", "role", "is_active"],
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to get users" });
  }
};
