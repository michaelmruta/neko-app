const helmet = require("helmet");
const cors = require("cors");

module.exports = function (app) {
  // cors
  app.use(
    cors({
      origin: ["http://localhost"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  // headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-access-token"
    );
    next();
  });

  // csp
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "frame-src": ["'self'", "https:"],
        "font-src": ["'self'", "'unsafe-inline'", "data:", "https:"],
        "img-src": ["'self'", "data:", "https:", "http:", "blob:"],
        "style-src": ["'self'", "'unsafe-inline'", "data:"],
        "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'", "data:"],
        "connect-src": [
          "'self'",
          "ws:",
          "wss:",
          "https://api.github.com",
          "https://connect.facebook.net",
        ],
        "default-src": [
          "'self'",
          "blob:",
          "localhost:*",
          "https://api.github.com",
          "https://connect.facebook.net",
        ],

        "worker-src": ["'self'", "blob:"],
        "script-src-elem": ["* 'unsafe-eval'", "'unsafe-inline'", "data:"],
      },
    })
  );

  return app;
};
