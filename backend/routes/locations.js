const express = require('express');
const router = express.Router();
const { getAllLocations, getLocationById, addReview, getStates } = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', getAllLocations);
router.get('/states', getStates);
router.get('/:id', getLocationById);
router.post('/:id/reviews', authenticateToken, addReview);

module.exports = router;
