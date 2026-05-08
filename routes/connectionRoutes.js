const express = require('express');
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getConnections,
  getPendingRequests,
  getSentRequests,
  removeConnection,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected (user must be logged in)
router.post('/send/:id', protect, sendRequest);
router.put('/accept/:id', protect, acceptRequest);
router.put('/reject/:id', protect, rejectRequest);
router.get('/', protect, getConnections);
router.get('/pending', protect, getPendingRequests);
router.get('/sent', protect, getSentRequests);
router.delete('/:id', protect, removeConnection);

module.exports = router;