/*!
 * Author/Licensor: Michael Angelo Ruta <michaelmruta@yahoo.com>
 * Copyright © 2020. All Rights Reserved.
 *
 * This file is part of a Neko Application and can not be
 * copied and/or distributed without the express
 * permission of the Author
 */

const dotenv = require("dotenv");
dotenv.config();

console.clear();

const fs = require("fs");
const path = require("path");
const log4js = require("./src/log4js");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "../client/dist")));

const sources = ["middlewares", "routes"];
for (let source of sources) {
  console.log(`\x1b[36m${source}:\x1b[0m`);
  fs.readdirSync(`./src/${source}`).forEach((filename) => {
    if (path.extname(filename) == ".js") {
      console.log("-", filename);
      require(`./src/${source}/${filename}`)(app);
    }
  });
}

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

app.listen(3000, function () {
  log4js.info("\x1b[36mListening on port 3000...\x1b[0m");
});
