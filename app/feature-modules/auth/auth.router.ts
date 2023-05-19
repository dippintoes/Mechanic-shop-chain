import { NextFunction, Request, Response, Router } from "express";
import authServices from "./auth.services";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import {
  CREATE_USER_VALIDATION,
  LOGIN_USER_VALIDATION,
} from "./auth.validations";

const router = Router();

router.post(
  "/login",
  LOGIN_USER_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authServices.login(req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/register",
  CREATE_USER_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authServices.register(req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const result = authServices.refreshToken(refreshToken);
    res.send(new RESPONSE_HANDLER(result));
  } catch (e) {
    next(e);
  }
});

export default router;
