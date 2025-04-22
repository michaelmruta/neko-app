const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  // cookies & JSON body
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    express.urlencoded({ extended: true, limit: "2mb", parameterLimit: 50000 })
  );

  // session
  app.use(
    session({
      secret: "!@#$%^&*()",
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60, // 1 hour
      },
    })
  );

  return app;
};
