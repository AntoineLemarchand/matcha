import { randomUUID } from 'crypto';
import { sendEmail } from '../auth/auth.controller.js';
import db from '../db.js';
import User from './user.model.js';

async function getAll(id, res) {
  const user = new User();
  try {
    const result = await user.getFromId(id);
    delete result.password;
    result.fame = await User.getFame(id);
    result.notifications = await User.getNotifications(id);
    if (isNaN(user.fame)) user.fame = 0;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getById(id, req, res) {
  const user = new User();
  try {
    const result = await user.getFromId(req.params.id);
    delete result.password;
    if (id !== req.params.id) {
      result.liked = await User.hasLiked(id, req.params.id);
      result.like_back = await User.hasLiked(req.params.id, id);
      result.blocked = [
        await User.hasBlocked(req.params.id, id),
        await User.hasBlocked(id, req.params.id)
      ];
      result.reported = [
        await User.hasReported(req.params.id, id),
        await User.hasReported(id, req.params.id)
      ]
    }
    result.fame = await User.getFame(id);
    if (isNaN(user.fame)) user.fame = 0;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    if (req.body.id) delete req.body.id;
    var previous = null;
    if (req.body.email) {
      const tempUser = new User();
      previous = (await tempUser.getFromId(req.params.id)).email;
    }
    const user = await User.update(req.params.id, req.body);
    if (previous && previous !== req.body.email) {
      const deleteSql = `UPDATE users SET verified = 0 WHERE id = ?`;
      await db.query(deleteSql, [user.id]);
      const sql = `INSERT INTO verification_code (user_id, code) VALUES (?, ?)`;
      const code = randomUUID();
      await db.query(sql, [user.id, code]);
      const subject = "Matcha: Email Update";
      const message = `<a href="https://${process.env.SERVER_URL}:${process.env.SERVER_PORT}/verify/${code}">Click here to verify your account</a>`;
      await sendEmail(user.email, subject, message);
    }
    return res.status(200).json({ message: "User updated" })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getPropositions(id, res) {
  const user = await (new User()).getFromId(id);
  try {
    if (!user.initialized) return res.status(400).json({ message: "User incomplete" });
    const result = await (new User).getPropositions(user.id, 10);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getLikes(id, res) {
  const user = await (new User()).getFromId(id);
  try {
    if (!user.initialized) return res.status(400).json({ message: "User incomplete" });
    const result = await (new User).getLikes(user.id, 10);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getViews(id, res) {
  const user = await (new User()).getFromId(id);
  try {
    if (!user.initialized) return res.status(400).json({ message: "User incomplete" });
    const views = await (new User).getViews(user.id);
    return res.status(200).json(views);
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
    return res.status(400).json({ message: error.message });
  }
}

async function getMessages(id, otherId, res) {
  try {
    const result = await User.getMessages(id, otherId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export default { getAll, getById, update, getPropositions, getLikes, getViews, action, getMessages }
