import express from "express";
import { registerRoutes } from "./routes/routes.route";

export const startServer = () => {
  const app = express();
  registerRoutes(app);
  const { PORT } = process.env;
  app.listen(PORT || 1234, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
