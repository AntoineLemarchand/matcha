import Swipe from '../swipe/swipe.model.js';
import Match from '../match/match.model.js';
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

  async getPropositions(id, amount = 10) {
    const currentUser = await this.getFromId(id);
    const description = currentUser.about ?? "";
    const tagRegex = /#(\w+)/g;
    const otherUsers = await this.getAll();
    let propositions = []

    let userHashtags = description.match(tagRegex) ?? [];
    if (typeof userHashtags === 'string') userHashtags = [userHashtags];

    for (const user of otherUsers) {
      const hasSwiped = await Swipe.hasSwiped(id, user.id);
      const hasMatched = await Match.hasMatched(id, user.id);
      if (user.id === id
        || hasSwiped
        || hasMatched
        || currentUser.gender_identity != user.gender_interest
        || currentUser.gender_interest != user.gender_identity
      ) continue;

      const userDescription = user.about ?? "";
      const otherHashtags = userDescription.match(tagRegex) ?? [];

      if (typeof otherHashtags === 'string') otherHashtags = [otherHashtags];
      let count = 0;
      for (const hashtag of userHashtags) {
        if (otherHashtags.includes(hashtag)) count++;
      }
      propositions.push([user, count]);
    }

    propositions = propositions.sort((a, b) => a[1] - b[1]).slice(0, amount);
    return propositions.map((proposition) => proposition[0]);
  }
}

export default User;
