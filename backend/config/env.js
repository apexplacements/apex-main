const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const explicitPath =
    process.env.DOTENV_CONFIG_PATH ||
    process.env.DOTENV_PATH ||
    process.env.ENV_PATH;

  const envPaths = [];
  if (explicitPath) {
    envPaths.push(path.resolve(explicitPath));
  }

  envPaths.push(path.join(__dirname, "..", ".env"));
  envPaths.push(path.join(__dirname, "..", "..", ".env"));
  envPaths.push(path.resolve(process.cwd(), ".env"));
  envPaths.push(path.resolve(process.cwd(), "..", ".env"));

  const uniqPaths = [...new Set(envPaths)];

  console.log("Env loader starting from:", {
    cwd: process.cwd(),
    dirname: __dirname,
    explicitPath: explicitPath || null,
    candidatePaths: uniqPaths,
  });

  for (const envPath of uniqPaths) {
    if (!fs.existsSync(envPath)) continue;

    const dotenvResult = dotenv.config({ path: envPath });
    if (!dotenvResult.error) {
      console.log(`Loaded environment variables from ${envPath}`);
      return { envPath, result: dotenvResult };
    }

    console.warn(`Attempted to load env from ${envPath} but got error:`, dotenvResult.error);
  }

  console.warn(
    "Warning: no .env file was found in backend or parent folders, and no environment file was loaded.",
    "Tried:",
    uniqPaths
  );

  return { envPath: null, result: null };
}

module.exports = {
  loadEnv,
};
