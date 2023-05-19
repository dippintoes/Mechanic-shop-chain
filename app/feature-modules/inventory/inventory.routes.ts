import { NextFunction, Request, Response, Router } from "express";
import {
  CREATE_INVENTORY_VALIDATION,
  FINDALL_PARTS_VALIDATION,
  FIND_DELETE_INVENTORY_VALIDATION,
  UPDATE_INVENTORY_VALIDATION,
} from "./inventory.validtions";
import { checkRoles } from "../../middlewares/checkRole";
import inventoryServices from "./inventory.services";
import mongoose from "mongoose";
import { RESPONSE_HANDLER } from "../../utility/response.handler";

const router = Router();

router.get(
  "/findAll",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  FINDALL_PARTS_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await inventoryServices.findAllParts(filter);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_INVENTORY_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await inventoryServices.findPart({
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
  CREATE_INVENTORY_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await inventoryServices.createPart(req.body);
      res.send(result);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  UPDATE_INVENTORY_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await inventoryServices.updatePart(
        { _id: new mongoose.mongo.ObjectId(req.params.id), isDeleted: false },
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
  FIND_DELETE_INVENTORY_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await inventoryServices.deletPart(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
