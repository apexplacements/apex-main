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
  // Determine whether loader should be silent.
  // Precedence: explicit ENV_LOADER_SILENT/DOTENV_SILENT -> otherwise silent in production only.
  const explicitSilent = (process.env.ENV_LOADER_SILENT || process.env.DOTENV_SILENT || "")
    .toString()
    .toLowerCase();
  const silent = explicitSilent === "true" ? true : explicitSilent === "false" ? false : (process.env.NODE_ENV === "production");
  for (const envPath of uniqPaths) {
    if (!fs.existsSync(envPath)) {
      if (!silent) console.debug && console.debug(`Env loader: ${envPath} not found`);
      continue;
    }

    const dotenvResult = dotenv.config({ path: envPath });
    if (!dotenvResult.error) {
      if (!silent) console.log && console.log(`Loaded environment variables from ${envPath}`);
      return { envPath, result: dotenvResult };
    }

    if (!silent) console.warn && console.warn(`Attempted to load env from ${envPath} but got error:`, dotenvResult.error);
  }

  if (!silent) console.warn && console.warn("Env loader: no .env file was found in candidate paths", uniqPaths);

  return { envPath: null, result: null };
}

module.exports = {
  loadEnv,
};
