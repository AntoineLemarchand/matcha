import User from './user.model.js';
import jwt from 'jsonwebtoken';

async function getAll(req, res) {
  const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  const user = new User();
  try {
    const result = await user.getFromId(id);
    delete result.password;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getById(req, res) {
  const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  const user = new User();
  try {
    const result = await user.getFromId(req.params.id);
    delete result.password;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
  if (!id || !req.params.id) return res.status(401).json({ message: "Unauthorized" });
  const user = new User();
  try {
    if (req.body.id) delete req.body.id;
    await user.update(req.params.id, req.body);
    return res.status(200).json({ message: "User updated" })
  } catch (error) {
    return res.status(500).json({ message: error.message, trace: error.stack });
  }
}

export default { getAll, getById, update };
