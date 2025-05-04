const rateLimit = require("express-rate-limit");

module.exports = function (app) {
  // heartbeat
  app.use("/ping", (req, res) => {
    res.send(new Date().getTime());
  });

  // rate limiter
  app.use(
    rateLimit({
      windowMs: 5000, // 5 second
      max: 200, // limit each IP to 200 or 500 requests per windowMs
      message: "Too many requests...",
    })
  );

  return app;
};
