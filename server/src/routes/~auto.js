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
          OR: [],
        }
      : {};

    const results = await model.findMany({
      skip: startIndex,
      take: limit,
      // where,
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
  const requireAdmin = (req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user || req.session.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };
  /**
   * @route GET /api/:auto
   * @desc Get paginated :auto list (Admin only)
   * @access Private/Admin
   */
  app.get(
    "/api/:auto",
    requireAdmin,
    (req, res, next) => {
      return paginatedResults(prisma[req.params.auto])(req, res, next);
    },
    async (req, res) => {
      res.json(res.paginatedResults);
    }
  );

  app.get("/api/:auto/:id", requireAdmin, async (req, res) => {
    try {
      console.log(req.params);
      const result = await prisma[req.params.auto].findUnique({
        where: { id: parseInt(req.params.id) },
      });
      res.json({ data: result });
    } catch (e) {
      res.json({ message: e.message });
    }
  });

  return app;
};
