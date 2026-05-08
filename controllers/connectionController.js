const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Send connection request
// @route   POST /api/connections/send/:id
// @access  Private
const sendRequest = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // Cannot send request to yourself
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if request already exists
    const existingRequest = await Connection.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Check if already connected (receiver already sent to sender)
    const reverseRequest = await Connection.findOne({
      sender: receiverId,
      receiver: senderId,
      status: 'accepted',
    });

    if (reverseRequest) {
      return res.status(400).json({ message: 'You are already connected' });
    }

    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({ message: 'Connection request sent', connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/accept/:id
// @access  Private
const acceptRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Only receiver can accept
    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to accept this request' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.json({ message: 'Connection accepted', connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/reject/:id
// @access  Private
const rejectRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Only receiver can reject
    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to reject this request' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({ message: 'Connection rejected', connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all my accepted connections
// @route   GET /api/connections
// @access  Private
const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { sender: req.user._id, status: 'accepted' },
        { receiver: req.user._id, status: 'accepted' },
      ],
    })
      .populate('sender', 'name email role bio profilePicture')
      .populate('receiver', 'name email role bio profilePicture');

    // Return the other person's info (not the logged in user)
    const myConnections = connections.map((conn) => {
      if (conn.sender._id.toString() === req.user._id.toString()) {
        return conn.receiver;
      } else {
        return conn.sender;
      }
    });

    res.json(myConnections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending requests (received)
// @route   GET /api/connections/pending
// @access  Private
const getPendingRequests = async (req, res) => {
  try {
    const pending = await Connection.find({
      receiver: req.user._id,
      status: 'pending',
    }).populate('sender', 'name email role bio profilePicture');

    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sent requests
// @route   GET /api/connections/sent
// @access  Private
const getSentRequests = async (req, res) => {
  try {
    const sent = await Connection.find({
      sender: req.user._id,
      status: 'pending',
    }).populate('receiver', 'name email role bio profilePicture');

    res.json(sent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove / Disconnect a connection
// @route   DELETE /api/connections/:id
// @access  Private
const removeConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Only sender or receiver can remove
    const isSender = connection.sender.toString() === req.user._id.toString();
    const isReceiver = connection.receiver.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await connection.deleteOne();

    res.json({ message: 'Connection removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getConnections,
  getPendingRequests,
  getSentRequests,
  removeConnection,
};