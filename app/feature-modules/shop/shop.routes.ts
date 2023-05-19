import { NextFunction, Request, Response, Router } from "express";
import {
  CREATE_SHOP_VALIDATION,
  FINDALL_SHOP_VALIDATION,
  FIND_DELETE_SHOP_VALIDATION,
  MONTHLY_REVENUE,
  UPDATE_SHOP_VALIDATION,
} from "./shop.validations";
import shopServices from "./shop.services";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import { checkRoles } from "../../middlewares/checkRole";
import mongoose from "mongoose";

const router = Router();

router.get(
  "/findAll",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await shopServices.findAllShops(filter);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484dfc224bdffff93bc8ca", "64484df4224bdffff93bc8c8"]),
  FIND_DELETE_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shopServices.findShop({
        _id: new mongoose.mongo.ObjectId(req.params.id),
      });
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/showAvailableRewards",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.tokenDecode;
      const filter = req.query;
      const result = await shopServices.showAvailableRewards(filter, id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/findAllRatings",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await shopServices.findAllRatings(filter);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/findMyRedeemRequests",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.tokenDecode;
      const filter = req.query;
      const result = await shopServices.findMyRedeemRequests(filter, id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/findMyRequests",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.tokenDecode;
      const filter = req.query;
      const result = await shopServices.findMyRequests(filter, id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/findMyHighestSellers",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await shopServices.findHighestSellingItem(filter);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/create",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  CREATE_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shopServices.createShop(req.body);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/monthlyRevenue",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  MONTHLY_REVENUE,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shopServices.monthlyRevenue(req.query);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/findHighestSellingItem",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FINDALL_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await shopServices.findHighestSellingItem(filter);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  UPDATE_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await shopServices.updateShop(
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
  FIND_DELETE_SHOP_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await shopServices.deletShop(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
