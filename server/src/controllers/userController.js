import User from '../models/user.js';

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
        return res.status(201).json({ message: "User created", user_id: newUser.id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getAll(req, res) {
    const user = new User();
    try {
        const result = await user.getAll();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getById(req, res) {
    const user = new User();
    try {
        const result = await user.getFromId(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function update(req, res) {
    const user = new User();
    try {
        const result = await user.update(req.params.id, req.body);
        res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message, trace: error.stack });
    }
}

export default { signup, getAll, getById, update };