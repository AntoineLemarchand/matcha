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
        console.log(token)
        res.cookie("token", token, { httpOnly: true });
        res.send("User created");
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
    // cookie is sent using credentials: true
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = new User();
        await user.getFromId(decoded.id);
        return res.status(200).json({ message: "User verified", user_id: decoded.id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default { signup, login, verify }
