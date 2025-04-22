const dotenv = require("dotenv");

process.env.TZ = "UTC";
process.env.NODE_ENV = process.env.NODE_ENV || "development";
// process.env.SERVICE_BOOT_TIME = new Date();

dotenv.config();

module.exports = {
  name: "Neko App",
  language: "en",
  version: 1.0,
};
