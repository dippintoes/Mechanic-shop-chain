import { NextFunction, Request, Response, Router } from "express";
import rewardsServices from "./rewards.services";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import {
  CREATE_REWARD_VALIDATION,
  FINDALL_REWARD_VALIDATION,
  FIND_DELETE_REWARD_VALIDATION,
  UPDATE_REWARD_VALIDATION,
} from "./rewards.validations";
import { checkRoles } from "../../middlewares/checkRole";
import mongoose from "mongoose";

const router = Router();

router.get(
  "/findAll/",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FINDALL_REWARD_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await rewardsServices.findAllRewards(filter, []);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_REWARD_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rewardsServices.findReward({
        _id: new mongoose.mongo.ObjectId(req.params.id),
      });
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/create",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  CREATE_REWARD_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rewardsServices.createReward(req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  UPDATE_REWARD_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await rewardsServices.updateReward(
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
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FIND_DELETE_REWARD_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rewardsServices.deletReward(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
