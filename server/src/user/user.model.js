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

  async update(id, data) {
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

  async getPropositions(id, amount) {
    const description = (await this.getFromId(id)).about ?? "";
    const tagRegex = /#(\w+)/g;
    let userHashtags = description.match(tagRegex) ?? [];
    if (typeof userHashtags === 'string') userHashtags = [userHashtags];
    const otherUsers = await this.getAll();
    const propositions = []
    for (const user of otherUsers) {
      if (user.id === id) continue;
      const userDescription = user.about ?? "";
      const otherHashtags = userDescription.match(tagRegex) ?? [];
      if (typeof otherHashtags === 'string') otherHashtags = [otherHashtags];
      let count = 0;
      for (const hashtag of userHashtags) {
        if (otherHashtags.includes(hashtag)) count++;
      }
      propositions.push([user.id, count]);
    }
    return propositions.sort((a, b) => b[1] - a[1]).slice(0, amount);
  }
}

export default User;
