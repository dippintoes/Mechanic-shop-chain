import express, {
  Application,
  NextFunction,
  Request,
  Response,
  json,
} from "express";
import { excludedPaths, routes } from "./routes.data";
import { RESPONSE_HANDLER } from "../utility/response.handler";
import { connectToMongo } from "../connections/connections.mongo";
import { authorize } from "../middlewares/authorize";

export const registerRoutes = (app: Application) => {
  app.use(json());

  app.use(authorize(excludedPaths));

  connectToMongo();

  for (let route of routes) {
    app.use(route.path, route.router);
  }

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).send(new RESPONSE_HANDLER(null, err));
    next();
  });
};
