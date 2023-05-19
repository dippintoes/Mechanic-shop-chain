import { NextFunction, Request, Response } from "express";

export const checkRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = res.locals.tokenDecode;
      console.log(role);
      for (let ele of roles) {
        if (ele === role) return next();
      }
      return next({ message: "Unauthorized Access", statusCode: 401 });
    } catch (e) {
      next(e);
    }
  };
};
