import { Router, Request, Response, NextFunction } from "express";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import redeemService from "./redeem.service";
import {
  FINDALL_REDEEM_VALIDATION,
  FIND_DELETE_REDEEM_VALIDATION,
  UPDATE_REDEEM_VALIDATION,
} from "./redeem.validation";
import { checkRoles } from "../../middlewares/checkRole";
import mongoose from "mongoose";

const router = Router();

router.get(
  "/findAll",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FINDALL_REDEEM_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await redeemService.findAllRequests(filter, []);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484dfc224bdffff93bc8ca", "64484df4224bdffff93bc8c8"]),
  FIND_DELETE_REDEEM_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await redeemService.findRequest(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  UPDATE_REDEEM_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await redeemService.updateRequest(
        { _id: new mongoose.mongo.ObjectId(req.params.id) },
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
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_REDEEM_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await redeemService.deleteRequest(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
