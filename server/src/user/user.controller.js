import User from './user.model.js';

async function getAll(id, res) {
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
  const user = new User();
  try {
    if (req.body.id) delete req.body.id;
    await user.update(req.params.id, req.body);
    return res.status(200).json({ message: "User updated" })
  } catch (error) {
    return res.status(500).json({ message: error.message, trace: error.stack });
  }
}

async function getPropositions(id, res) {
  const user = await (new User()).getFromId(id);
  try {
    if (!user.initialized) return res.status(400).json({ message: "User incomplete" });
    const result = await (new User).getPropositions(user.id, 10);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default { getAll, getById, update, getPropositions}
