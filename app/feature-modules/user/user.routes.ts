import { NextFunction, Request, Response, Router } from "express";
import userServices from "./user.services";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import {
  APPROVE_REQUESTS,
  CREATE_REQUEST_VALIDATION,
} from "../requests/requests.validation";
import { checkRoles } from "../../middlewares/checkRole";
import { CREATE_SALE_VALIDATION } from "../sales/sales.validation";
import mongoose from "mongoose";
import { CREATE_REDEEM_VALIDATION } from "../redeem/redeem.validation";
import {
  FINDALL_USERS_VALIDATION,
  RUD_USERS_VALIDATION,
  VALIDATE_REVENUE,
} from "./user.validations";
import { CREATE_RATING_VALIDATION } from "../ratings/ratings.validations";
import { APPROVE_REWARDS } from "../rewards/rewards.validations";

const router = Router();

router.get(
  "/find/:id",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  RUD_USERS_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userServices.findUser({
        _id: new mongoose.mongo.ObjectId(req.params.id),
      });
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/findAll",
  FINDALL_USERS_VALIDATION,
  checkRoles(["64484df4224bdffff93bc8c8"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await userServices.findAll(filter);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/request",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  CREATE_REQUEST_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.tokenDecode;
      const result = await userServices.requestPart(id, req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/approve/:reqid",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  APPROVE_REQUESTS,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reqid } = req.params;
      const ids = req.query.ids as string;
      const objectIdArray = ids
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id));
      const result = await userServices.approveRequest(reqid, objectIdArray);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/sale",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  CREATE_SALE_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.tokenDecode;
      const result = await userServices.createSale(id, req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/redeem",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  CREATE_REDEEM_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.tokenDecode;
      const result = await userServices.redeemReward(id, req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/validateRevenue/:shopid",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  VALIDATE_REVENUE,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;
      const result = await userServices.validateRevenue(
        req.params.shopid,
        amount
      );
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/approveReward/:reqid",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  APPROVE_REWARDS,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reqid } = req.params;
      const result = await userServices.approveReward(reqid);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/rating",
  CREATE_RATING_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userServices.rate(
        req.body.shopid,
        Number(req.body.rating)
      );
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  RUD_USERS_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await userServices.updateUser(
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
  checkRoles(["64484df4224bdffff93bc8c8"]),
  RUD_USERS_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userServices.deleteUser({
        _id: new mongoose.mongo.ObjectId(req.params.id),
      });
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
