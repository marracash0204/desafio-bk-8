import dotenv from "dotenv";

dotenv.config();

const config = {
  mongoURI: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  passportGitHubClientId: process.env.PASSPORT_GITHUB_CLIENT_ID,
  passportGitHubClientSecret: process.env.PASSPORT_GITHUB_CLIENT_SECRET,
};

export default config;
