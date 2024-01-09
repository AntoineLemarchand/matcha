import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

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
        return res.status(500).json({ message: error.message });
    }
}

export async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }
    const user = new User(email, password);
    if (!user.validateCredentials()) {
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
        return res.status(500).json({ message: error.message });
    }
}

export default { signup, login, verify }
