const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("../database");

module.exports = function (app) {
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
        secure: process.env.NODE_ENV === "production",
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
