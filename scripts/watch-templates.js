const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname, "..");

// Path to the directory containing template files
const generationScript = path.join(projectRoot, "scripts", "generate-ui.js");
const templateDir = path.join(projectRoot, "scripts", "templates");

// Watch for changes in template files
const watcher = chokidar.watch([generationScript, templateDir], {
  ignored: (file, _stats) => _stats?.isFile() && !file.endsWith(".js"),
  awaitWriteFinish: true,
  persistent: true,
});

// Log when a file is added, changed, or unlinked
watcher.on("change", (path) => {
  console.log(`File ${path} has been changed`);
  runGenerateUI();
});
watcher.on("unlink", (path) => console.log(`File ${path} has been removed`));

watcher.on("ready", () => {
  console.log("Monitored files:", watcher.getWatched());
});

// Function to run generate-ui.js
function runGenerateUI() {
  const generateUiPath = path.join(projectRoot, "scripts", "generate-ui.js");
  exec(`node ${generateUiPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running generate-ui.js: ${error}`);
      return;
    }
    if (stdout) {
      console.log(`Output from generate-ui.js:\n${stdout}`);
    }
    if (stderr) {
      console.error(`Error output from generate-ui.js:\n${stderr}`);
    }
  });
}

// Handle any errors
watcher.on("error", (error) => console.error(`Watcher error: ${error}`));
