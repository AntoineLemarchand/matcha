import bcrypt from 'bcrypt';
import db from '../db.js';

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  hashPassword() {
    return bcrypt.hash(this.password, 10);
  }

  async validateCredentials() {
    try {
      const user = await this.getFromEmail(this.email);
      if (user) {
        const valid = await bcrypt.compare(this.password, user.password);
        if (valid) {
          return user;
        } else {
          return;
        }
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async saveToDB() {
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const params = [this.email, await this.hashPassword()];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    const sql = `SELECT * FROM users`;
    try {
      const result = await db.query(sql);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getFromId(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const params = [id];
    try {
      const result = await db.query(sql, params);
      const ret = result[0];
      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getFromEmail() {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const params = [this.email];
    try {
      const result = await db.query(sql, params);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    let userData = data;

    var setString = Object.keys(userData)
    .map((key) => `${key} = ?`)
    .join(', ')

    const sql = `UPDATE users SET ${setString} WHERE id = ?;`;
    const params = [...Object.values(userData), id];

    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async hasLiked(userId, otherUserId) {
    const sql = `SELECT * FROM likes
      WHERE user_id = ? AND liked_user_id = ?
      `
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      const ret = result[0] ? true : false
      return ret;
    } catch (error) {
      throw error;
    }
  }

  static async hasBlocked(userId, otherUserId) {
    const sql = `SELECT * FROM blocks
      WHERE user_id = ? AND blocked_user_id = ?
      `
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      const ret = result[0] ? true: false;
      return ret;
    } catch (error) {
      throw error;
    }
  }

  static async hasReported(userId, otherUserId) {
    const sql = `SELECT * FROM reports
      WHERE user_id = ? AND reported_user_id = ?
      `
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      const ret = result[0] ? true: false;
      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getPropositions(id, amount = 10) {
    const currentUser = await this.getFromId(id);
    const otherUsers = await this.getAll();
    let propositions = []

    for (const user of otherUsers) {
      const hasLiked = await User.hasLiked(id, user.id);
      const hasBlocked = await User.hasBlocked(id, user.id);
      const hasReported = await User.hasReported(id, user.id);
      if (user.id === id
        || hasLiked
        || hasBlocked
        || hasReported
        || currentUser.gender_identity != user.gender_interest
        || currentUser.gender_interest != user.gender_identity
      ) continue;

      let count = 0;
      user.fame = await User.getFame(user.id);
      user.count = User.countTags(user.tags, currentUser.tags);
      propositions.push([user, count]);
    }

    propositions = propositions.sort((a, b) => a[1] - b[1]).slice(0, amount);
    return propositions.map((proposition) => proposition[0]);
  }

  static countTags(tags1, tags2) {
    const userHashtags = tags1.split('|').filter((tag) => tag !== '');
    const otherHashtags = tags2.split('|').filter((tag) => tag !== '');
    let count = 0;
    for (const hashtag of userHashtags) {
      if (otherHashtags.includes(hashtag)) count++;
    }
    return count;
  }

  async getLikes(id) {
    const sql = `
      SELECT user.* FROM likes 
      LEFT JOIN users AS user ON likes.liked_user_id = user.id
      WHERE likes.user_id = ?
    `;
    const params = [id];
    try {
      const result = await db.query(sql, params);
      for (const user of result) {
        const currentUser = await this.getFromId(id);
        user.fame = await User.getFame(user.id);
        user.count = User.countTags(user.tags, currentUser.tags);
      }

      const ret = result;
      return ret;
    } catch (error) {
      throw error;
    };
  }

  async getViews(id) {
    const sql = `
      SELECT 
        history.*,
        user1.first_name AS user_first_name,
        user1.last_name AS user_last_name,
        user2.first_name AS viewed_user_first_name,
        user2.last_name AS viewed_user_last_name
      FROM history 
      LEFT JOIN users AS user1 ON history.user_id = user1.id
      LEFT JOIN users AS user2 ON history.viewed_user_id = user2.id
      WHERE history.viewed_user_id = ? OR history.user_id = ?
      ORDER BY date_viewed DESC;
    `;
    const params = [id, id];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async like(userId, otherUserId) {
    let sql = `INSERT INTO history (user_id, viewed_user_id, action) VALUES (?, ?, 'like')`;
    let params = [userId, otherUserId];
    await db.query(sql, params);
    sql = `INSERT IGNORE INTO likes (user_id, liked_user_id) VALUES (?, ?)`;
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async unlike(userId, otherUserId) {
    const sql = `DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?`;
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async block(userId, otherUserId) {
    const sql = `INSERT IGNORE INTO blocks (user_id, blocked_user_id) VALUES (?, ?)`;
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async unblock(userId, otherUserId) {
    const sql = `DELETE FROM blocks WHERE user_id = ? AND blocked_user_id = ?`;
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async report(userId, otherUserId) {
    const sql = `INSERT INTO reports (user_id, reported_user_id) VALUES (?, ?)`;
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async view(userId, otherUserId) {
    const sql = `INSERT INTO history (user_id, viewed_user_id, action) VALUES (?, ?, 'seen')`;
    const params = [userId, otherUserId];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async sendMessage(from, to, message) {
    const sql = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`;
    const params = [from, to, message];
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getMessages(from, to) {
    const sql = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`;
    const params = [from, to, to, from];
    try {
      const result = await db.query(sql, params);
      result.forEach((message) => {
        message.from = message.sender_id;
        message.to = message.receiver_id;
        delete message.sender_id;
        delete message.receiver_id;
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getFame(id) {
    // calculate fame (fame = likes + views * 0.1 - reports * 3 - blocks * 2)
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM likes WHERE liked_user_id = ?) AS likes,
        (SELECT COUNT(*) FROM history WHERE viewed_user_id = ? AND action = 'seen') AS views,
        (SELECT COUNT(*) FROM reports WHERE reported_user_id = ?) AS reports,
        (SELECT COUNT(*) FROM blocks WHERE blocked_user_id = ?) AS blocks
      `;
    const params = [id, id, id, id];
    try {
      const result = await db.query(sql, params);
      const ret = Number(result[0].likes) + 
                  Number(result[0].views) * 0.1 - 
                  Number(result[0].reports) * 3 - 
                  Number(result[0].blocks) * 2;
      return ret;
    } catch (error) {
      throw error;
    }
  }
}

export default User;
