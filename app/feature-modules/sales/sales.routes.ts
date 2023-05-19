import { Router, Request, Response, NextFunction } from "express";
import salesService from "./sales.service";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import {
  FINDALL_SALE_VALIDATION,
  FIND_DELETE_SALE_VALIDATION,
  UPDATE_SALE_VALIDATION,
} from "./sales.validation";
import { checkRoles } from "../../middlewares/checkRole";

const router = Router();

router.get(
  "/findAll",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  FINDALL_SALE_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await salesService.findAllSales(filter, []);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_SALE_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await salesService.findSale(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  UPDATE_SALE_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await salesService.updateSale(req.params.id, req.body);
      res.send(new RESPONSE_HANDLER(request));
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/delete/:id",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_SALE_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await salesService.deleteSale(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
