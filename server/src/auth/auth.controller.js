import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { randomUUID } from "crypto";
import db from "../db.js";
import nodemailer from "nodemailer";

export async function signup(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const user = new User(email, password);
  const userExists = await user.getFromEmail();

  if (userExists) {
    return res.status(400).json({ message: "Email already taken" });
  }
  try {
    await user.saveToDB();
    const newUser = await user.getFromEmail(email);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  let user = new User(email, password);
  user = await user.validateCredentials();
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true, sameSite: true });
  return res.status(200).json({ message: "User logged in" });
}

export async function verify(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await (new User()).getFromId(decoded.id);
    delete user.password;
    return res.status(200).json({ message: "User verified", user: user, initialized: user.initialized });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }
  const user = await (new User()).getFromEmail(email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const sql = `INSERT INTO recovery_code (user_id, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = ?`;
  const code = randomUUID()
  const params = [user.id, code, code];

  try {
    await db.query(sql, params);
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    })

    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Matcha: Password Recovery",
      html: `<a href="${process.env.SERVER_URL}:${process.env.SERVER_PORT}/recovery/${code}">Click here to recover your password</a>`,
    };
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Recovery code sent" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const validateRecoveryCode = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "Missing code" });
  }
  const sql = `SELECT user_id FROM recovery_code WHERE code = ?`;
  const params = [code];
  try {
    const result = await db.query(sql, params);
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid recovery code" });
    }
    return res.status(200).json({ message: "Recovery code valid" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const passwordChange = async (req, res) => {
  const { code, password } = req.body;
  if (!code || !password) {
    return res.status(400).json({ message: "Missing code or password" });
  }
  try {
    let sql = `SELECT user_id FROM recovery_code WHERE code = ?`;
    const params = [code];
    const result = await db.query(sql, params);
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid recovery code" });
    }
    sql = `DELETE FROM recovery_code WHERE code = ?`;
    await db.query(sql, params);
    const user = await (new User()).getFromId(result[0].user_id);
    User.update(user.id, { password: await User.hashPassword(password) })
    return res.status(200).json({ message: "Password changed" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export default { signup, login, verify, forgotPassword, validateRecoveryCode, passwordChange }
