const { PrismaClient } = require("@prisma/client");

module.exports = function (cwd) {
  return new PrismaClient();
};
