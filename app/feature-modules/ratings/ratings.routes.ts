import { Router, Request, Response, NextFunction } from "express";
import ratingsServices from "./ratings.services";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import {
  CREATE_RATING_VALIDATION,
  FIND_DELETE_RATING_VALIDATION,
  FINDALL_RATING_VALIDATION,
  UPDATE_RATING_VALIDATION,
} from "./ratings.validations";
import { checkRoles } from "../../middlewares/checkRole";

const router = Router();

router.get(
  "/findAll",
  checkRoles(["64484dfc224bdffff93bc8ca", "64484df4224bdffff93bc8c8"]),
  FINDALL_RATING_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const { id } = res.locals.tokenDecode;
      const result = await ratingsServices.findMyRatings(filter, id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484dfc224bdffff93bc8ca", "64484df4224bdffff93bc8c8"]),
  FIND_DELETE_RATING_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ratingsServices.findRating(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/create",
  CREATE_RATING_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ratingsServices.createRating(req.body);
      res.send(result);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  UPDATE_RATING_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await ratingsServices.updateRating(
        req.params.id,
        req.body
      );
      res.send(new RESPONSE_HANDLER(request));
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/delete/:id",
  FIND_DELETE_RATING_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ratingsServices.deletRating(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
