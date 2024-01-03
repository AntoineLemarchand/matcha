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
        return res.status(201).json({ message: "User created", token: generateTokenForUser(newUser.email) });
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
    return res.status(200).json({ message: "User logged in", token: user.generateTokenForUser(user.email) })
}

export async function generateTokenForUser(email) {
  try {
      const user = await user.getFromEmail(email);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return token;
  } catch (error) {
      throw error;
  }
}

export default { signup, login, generateTokenForUser }
