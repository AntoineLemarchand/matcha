import db from '../db.js';

export default class Swipe {
  constructor() {}

  static async getForUser(userId) {
      const sql = `SELECT * FROM swipes WHERE user_id = ?`;
      const params = [userId];
      try {
        const result = await db.query(sql, params);
        const ret = result[0];
        return ret;
      } catch (error) {
        throw error;
      }
  }

  static async hasSwiped(userId, otherUserId) {
    const sql = `SELECT * FROM swipes
      WHERE user_id = ? AND swiped_id = ?
      `
    const params = [userId, otherUserId];
      try {
      const result = await db.query(sql, params);
      const ret = result[0];
      return ret;
      } catch (error) {
      throw error;
      }
    }
}
