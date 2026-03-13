const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.post('/chat', authenticateToken, chat);

module.exports = router;
