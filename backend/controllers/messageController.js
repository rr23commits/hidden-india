const db = require('../models/db');

const getMessages = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { limit = 50, before } = req.query;

    let query = `
      SELECT m.*, u.name as user_name 
      FROM messages m 
      JOIN users u ON m.user_id = u.id 
      WHERE m.location_id = ?
    `;
    const params = [locationId];

    if (before) {
      query += ' AND m.id < ?';
      params.push(before);
    }

    query += ' ORDER BY m.timestamp DESC LIMIT ?';
    params.push(parseInt(limit));

    const [messages] = await db.query(query, params);

    res.json({ messages: messages.reverse() });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const postMessage = async (req, res) => {
  try {
    const { location_id, message } = req.body;
    const user_id = req.user.id;

    if (!location_id || !message || !message.trim()) {
      return res.status(400).json({ error: 'Location ID and message are required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 characters)' });
    }

    // Verify location exists
    const [locations] = await db.query('SELECT id FROM locations WHERE id = ?', [location_id]);
    if (locations.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const [result] = await db.query(
      'INSERT INTO messages (user_id, location_id, message) VALUES (?, ?, ?)',
      [user_id, location_id, message.trim()]
    );

    // Get the created message with user info
    const [messages] = await db.query(
      `SELECT m.*, u.name as user_name 
       FROM messages m 
       JOIN users u ON m.user_id = u.id 
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ message: messages[0] });
  } catch (err) {
    console.error('Post message error:', err);
    res.status(500).json({ error: 'Failed to post message' });
  }
};

module.exports = { getMessages, postMessage };
