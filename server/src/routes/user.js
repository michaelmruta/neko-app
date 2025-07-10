const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma = require("../database");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../mailer");

// Pagination middleware
const paginatedResults = (model) => async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const q = req.query.q || "";
  const startIndex = (page - 1) * limit;

  try {
    // Build a filter if a search query is provided.
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const results = await model.findMany({
      skip: startIndex,
      take: limit,
      // where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const total = await model.count();

    res.paginatedResults = {
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      results,
    };
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error fetching paginated results" });
  }
};

module.exports = function (app) {
  // Forgot Password
  /**
   * @route POST /api/users/forgot-password
   * @desc Request password reset
   * @access Public
   */
  app.post("/api/users/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Don't reveal if user exists
        return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
      }
      const resetToken = require("crypto").randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });
      const { sendPasswordResetEmail } = require("../mailer");
      await sendPasswordResetEmail(email, resetToken);
      res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route POST /api/users/reset-password
   * @desc Reset password with token
   * @access Public
   */
  app.post("/api/users/reset-password", async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    try {
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gte: new Date() },
        },
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      const salt = await require("bcrypt").genSalt(10);
      const hashedPassword = await require("bcrypt").hash(password, salt);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
      res.status(200).json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin middleware
  const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };
  /**
   * @route POST /api/users/register
   * @desc Register a new user
   * @access Public
   */
  app.post("/api/users/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role: "USER",
          password: hashedPassword,
          verificationToken,
          isVerified: false,
        },
      });

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message:
          "User registered successfully. Please check your email to verify your account.",
        userId: user.id,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route GET /api/users/verify/:token
   * @desc Verify user email
   * @access Public
   */
  app.get("/api/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;

      // Find user with this verification token
      const user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });

      if (!token || !user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }

      // Update user to verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      res
        .status(200)
        .json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route POST /api/users/login
   * @desc Authenticate user & get token
   * @access Public
   */
  /**
   * @route GET /api/users
   * @desc Get paginated users list (Admin only)
   * @access Private/Admin
   */
  app.get(
    "/api/users",
    // requireAdmin,
    paginatedResults(prisma.user),
    async (req, res) => {
      res.json(res.paginatedResults);
    }
  );

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      // Check if email is verified
      if (user.isVerified === false) {
        return res
          .status(400)
          .json({ message: "Please verify your email before logging in" });
      }

      // Check password
      console.log("password", user.password);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials.." });
      }

      // Set user in session
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      });

      res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route POST /api/users/forgot-password
   * @desc Request password reset
   * @access Public
   */
  app.post("/api/users/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal that the user doesn't exist
        return res.status(200).json({
          message:
            "If your email is registered, you will receive a password reset link",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save token to user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email
      await sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route POST /api/users/reset-password/:token
   * @desc Reset password
   * @access Public
   */
  app.post("/api/users/reset-password/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      // Find user with this reset token and check if token is expired
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      res.status(200).json({
        message:
          "Password reset successful. You can now log in with your new password.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route GET /api/users/logout
   * @desc Logout user / clear session
   * @access Private
   */
  app.get("/api/users/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  /**
   * @route GET /api/users/me
   * @desc Get current user profile
   * @access Private
   */
  app.get("/api/users/me", async (req, res) => {
    console.log(req.session.user);
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
          avatar: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route POST /api/users/avatar
   * @desc Upload user avatar
   * @access Private
   */
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");
  const DATA_DIR = path.join(__dirname, "../../../data");
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DATA_DIR);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `avatar_${req.session.user.id}${ext}`);
    },
  });
  const upload = multer({ storage });

  app.post("/api/users/avatar", upload.single("avatar"), async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const ext = path.extname(req.file.originalname);
      const avatarFilename = `avatar_${req.session.user.id}${ext}`;
      await prisma.user.update({
        where: { id: req.session.user.id },
        data: { avatar: avatarFilename },
      });
      res.json({ success: true, avatar: avatarFilename });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * @route GET /api/users/avatar/:id
   * @desc Serve user avatar
   * @access Public
   */
  app.get("/api/users/avatar/:id", async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        select: { avatar: true },
      });
      if (!user || !user.avatar) {
        return res
          .status(404)
          .sendFile(
            path.join(__dirname, "../../../client/public/default-avatar.png")
          );
      }
      const avatarPath = path.join(DATA_DIR, user.avatar);
      if (!fs.existsSync(avatarPath)) {
        return res
          .status(404)
          .sendFile(
            path.join(__dirname, "../../../client/public/default-avatar.png")
          );
      }
      res.sendFile(avatarPath);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return app;
};
