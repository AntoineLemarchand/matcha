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

async function getById(id, req, res) {
  const user = new User();
  try {
    const result = await user.getFromId(req.params.id);
    delete result.password;
    if (id !== req.params.id) {
      result.liked = await User.hasLiked(id, req.params.id);
      result.blocked = await User.hasBlocked(id, req.params.id)
      result.reported = await User.hasReported(id, req.params.id)
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    if (req.body.id) delete req.body.id;
    await User.update(req.params.id, req.body);
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

async function getLikes(id, res) {
  const user = await (new User()).getFromId(id);
  try {
    if (!user.initialized) return res.status(400).json({ message: "User incomplete" });
    const result = await (new User).getLikes(user.id, 10);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function action(id, user_id, action, res) {
  const user = new User();
  try {
    switch (action) {
      case 'like':
        await user.like(id, user_id);
        break;
      case 'unlike':
        await user.unlike(id, user_id);
        break;
      case 'block':
        await user.block(id, user_id);
        break;
      case 'unblock':
        await user.unblock(id, user_id);
        break;
      case 'report':
        await user.report(id, user_id);
        break;
      default:
        return res.status(400).json({ message: "Bad request" });
    }
    return res.status(200).json({ message: "Action done" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getMessages(id, otherId, res) {
  try {
    const result = await User.getMessages(id, otherId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default { getAll, getById, update, getPropositions, getLikes, action, getMessages }
