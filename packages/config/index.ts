import { config } from "dotenv";

config();

export const appConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "8000"),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  SECRET_KEY: process.env.SECRET_KEY || "thatsthebestsecretkey",
};
