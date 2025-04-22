const log4js = require("log4js");

module.exports = log4js
  .configure({
    appenders: {
      default: {
        type: "dateFile",
        pattern: ".yyyy-MM-dd",
        numBackups: 10,
        filename: "./logs/logs.log",
        maxLogSize: 10485760,
        layout: {
          type: "pattern",
          pattern: "%[%d{yyyy/MM/dd hh:mm.ss} %p%] %m",
        },
      },
      console: {
        type: "console",
      },
    },
    categories: {
      default: { appenders: ["default", "console"], level: "info" },
    },
  })
  .getLogger();
