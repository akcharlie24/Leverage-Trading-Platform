import { config } from "dotenv";

config();

export const appConfig = {
  PORT: parseInt(process.env.PORT || "8000"),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
