const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Post = require("../models/post");

const router = express.Router();

// =========================
// IMAGE UPLOAD SETUP
// =========================

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// =========================
// AUTHENTICATION
// =========================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =========================
// CREATE POST
// TEXT + IMAGE / TEXT ONLY / IMAGE ONLY
// =========================

router.post(
  "/",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    try {
      const content = req.body.content || "";

      const image = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      if (!content.trim() && !image) {
        return res.status(400).json({
          message: "Post must contain text or an image",
        });
      }

      const post = await Post.create({
        username: req.user.username,
        content: content.trim(),
        image,
        likes: [],
        comments: [],
      });

      res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (error) {
      console.error("Create post error:", error);

      res.status(500).json({
        message: "Failed to create post",
        error: error.message,
      });
    }
  }
);

// =========================
// GET ALL POSTS
// =========================

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
});

// =========================
// LIKE / UNLIKE
// =========================

router.post(
  "/:postId/like",
  authenticateUser,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      const username = req.user.username;

      const alreadyLiked =
        post.likes.includes(username);

      if (alreadyLiked) {
        post.likes = post.likes.filter(
          (user) => user !== username
        );
      } else {
        post.likes.push(username);
      }

      await post.save();

      res.json({
        message: alreadyLiked
          ? "Post unliked"
          : "Post liked",
        likes: post.likes,
        likesCount: post.likes.length,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to like post",
        error: error.message,
      });
    }
  }
);

// =========================
// ADD COMMENT
// =========================

router.post(
  "/:postId/comment",
  authenticateUser,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text?.trim()) {
        return res.status(400).json({
          message: "Comment cannot be empty",
        });
      }

      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      post.comments.push({
        username: req.user.username,
        text: text.trim(),
      });

      await post.save();

      res.status(201).json({
        message: "Comment added successfully",
        comments: post.comments,
        commentsCount: post.comments.length,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add comment",
        error: error.message,
      });
    }
  }
);

module.exports = router;