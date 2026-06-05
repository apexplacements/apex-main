const dotenv = require("dotenv");
const path = require("path");

function loadEnv() {
  const envPaths = [
    path.join(__dirname, "..", ".env"),
    path.join(__dirname, "..", "..", ".env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
  ];

  let dotenvResult;
  for (const envPath of envPaths) {
    dotenvResult = dotenv.config({ path: envPath });
    if (!dotenvResult.error) {
      console.log(`Loaded environment variables from ${envPath}`);
      return { envPath, result: dotenvResult };
    }
  }

  console.warn(
    "Warning: no .env file was found in backend or parent folders, and no environment file was loaded.",
    "Tried:",
    envPaths
  );

  return { envPath: null, result: dotenvResult };
}

module.exports = {
  loadEnv,
};
