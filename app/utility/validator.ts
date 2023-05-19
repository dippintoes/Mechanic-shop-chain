import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const validResult = validationResult(req);
  if (!validResult.isEmpty()) {
    return next({ statusCode: 400, errors: validResult.array() });
  }
  next();
};
