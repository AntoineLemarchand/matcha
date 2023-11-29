import User from '../models/user.js';

export async function signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).json({ message: "Missing email or password" });
    }

    const user = new User(email, password);
    const userExists = await user.getFromEmail();
    
    if (userExists) {
        res.status(400).json({ message: "Email already taken" });
    }
    try {
        await user.saveToDB();
        const newUser = await user.getFromEmail(email);
        res.status(201).json({ message: "User created", user_id: newUser.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAll(req, res) {
    const newUser = new User();
    try {
        const result = await user.getAll();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default { signup, getAll };