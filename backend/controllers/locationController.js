const db = require('../models/db');

const getAllLocations = async (req, res) => {
  try {
    const { state, search, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM locations WHERE 1=1';
    const params = [];

    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY rating DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [locations] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM locations WHERE 1=1';
    const countParams = [];
    if (state) { countQuery += ' AND state = ?'; countParams.push(state); }
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const s = `%${search}%`;
      countParams.push(s, s, s);
    }

    const [countResult] = await db.query(countQuery, countParams);

    res.json({
      locations,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [locations] = await db.query('SELECT * FROM locations WHERE id = ?', [id]);

    if (locations.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const location = locations[0];

    // Get reviews with user info
    const [reviews] = await db.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.location_id = ? 
       ORDER BY r.created_at DESC 
       LIMIT 10`,
      [id]
    );

    res.json({ location, reviews });
  } catch (err) {
    console.error('Get location error:', err);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check location exists
    const [locations] = await db.query('SELECT id FROM locations WHERE id = ?', [id]);
    if (locations.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Insert review
    await db.query(
      'INSERT INTO reviews (user_id, location_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id, id, rating, comment || '']
    );

    // Update location rating
    const [avgResult] = await db.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE location_id = ?',
      [id]
    );

    await db.query(
      'UPDATE locations SET rating = ?, review_count = ? WHERE id = ?',
      [parseFloat(avgResult[0].avg_rating).toFixed(1), avgResult[0].count, id]
    );

    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

const getStates = async (req, res) => {
  try {
    const [states] = await db.query(
      'SELECT DISTINCT state FROM locations ORDER BY state ASC'
    );
    res.json({ states: states.map(s => s.state) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states' });
  }
};

module.exports = { getAllLocations, getLocationById, addReview, getStates };
