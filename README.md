# EntreNet 🚀

EntreNet is a full-stack professional networking platform designed specifically for entrepreneurs, investors, and mentors. It provides a dedicated space to share ideas, seek funding, find collaborators, and build a meaningful professional network.

## 🛠️ Tech Stack

**Frontend:**
* HTML
* JavaScript 
* Tailwind CSS (via CDN)
* Fetch API for asynchronous requests

**Backend:**
* Node.js
* Express.js
* MongoDB (Mongoose ODM)
* JSON Web Tokens (JWT) for secure authentication
* bcryptjs for password hashing

## ✨ Key Features

* **Secure Authentication:** Complete user registration and login flow using JWT stored in local storage.
* **Role-Based Profiles:** Users can identify as an Entrepreneur, Investor, or Mentor.
* **Dynamic Feed:** A global feed where users can post updates, ideas, and news.
* **Post Categorization & Tagging:** Posts are visually categorized (Idea, Funding, Hiring, News) and support custom tags.
* **Interactive Engagement:** Users can like and delete their own posts with real-time UI updates.
* **Connection System:** A fully functional networking system allowing users to discover others, send connection requests, and accept/reject pending invites.

## 📂 Project Structure

```text
entrepreneurial-network/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── authController.js     # Login, register, profile logic
│   ├── connectionController.js # Network request handling
│   └── postController.js     # Feed and post management
├── frontend/
│   ├── feed.html             # Global post feed
│   ├── login.html            # User authentication
│   ├── network.html          # Connection management dashboard
│   └── register.html         # User onboarding
├── middleware/
│   └── authMiddleware.js     # JWT route protection
├── models/
│   ├── connection.js         # Connection schema
│   ├── post.js               # Post schema
│   └── user.js               # User schema
├── routes/
│   ├── authRoutes.js
│   ├── connectionRoutes.js
│   └── postRoutes.js
├── .env                      # Environment variables
├── package.json
└── server.js                 # Express application entry point