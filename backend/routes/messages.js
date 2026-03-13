const express = require('express');
const router = express.Router();
const { getMessages, postMessage } = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:locationId', getMessages);
router.post('/', authenticateToken, postMessage);

module.exports = router;
