const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("../database");

module.exports = function (app) {
  // CORS for local dev
  const cors = require('cors');
  app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true
  }));

  // cookies & JSON body
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    express.urlencoded({ extended: true, limit: "2mb", parameterLimit: 50000 })
  );

  // session with Prisma store
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "!@#$%^&*()",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // always false for local dev, set to true in production with HTTPS
        sameSite: 'lax', // lax is good for most SPA auth flows
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000, // Clean up expired sessions every 2 minutes
        dbRecordIdIsSessionId: true,
      }),
    })
  );

  return app;
};
