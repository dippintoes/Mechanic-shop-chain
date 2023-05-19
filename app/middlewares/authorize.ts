import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { verify } from "jsonwebtoken";
import path from "path";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ExcludedPath {
  constructor(public path: string, public method: Method) {}
}

export type ExcludedPaths = ExcludedPath[];

export const authorize = (excludedPaths: ExcludedPaths) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        excludedPaths.find((e) => e.path === req.url && e.method === req.method)
      ) {
        console.log(req.url, req.method);
        return next();
      }
      // console.log("inside");
      const token = req.headers.authorization?.split(" ")[1];
      const PUBLIC_KEY = fs.readFileSync(
        path.resolve(__dirname, "..\\keys\\public.pem"),
        { encoding: "utf-8" }
      );
      const tokenDecode = verify(token || "", PUBLIC_KEY || "");
      res.locals.tokenDecode = tokenDecode;
      console.log(tokenDecode);
      next();
    } catch (e) {
      next(e);
    }
  };
};
