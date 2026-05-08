const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  getMyPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected (user must be logged in)
router.post('/', protect, createPost);
router.get('/', protect, getAllPosts);
router.get('/myposts', protect, getMyPosts);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

module.exports = router;