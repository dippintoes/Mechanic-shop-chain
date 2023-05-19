import { Router, Request, Response, NextFunction } from "express";
import requestsService from "./requests.service";
import { RESPONSE_HANDLER } from "../../utility/response.handler";
import {
  FINDALL_REQUEST_VALIDATION,
  FIND_DELETE_REQUEST_VALIDATION,
  UPDATE_REQUEST_VALIDATION,
} from "./requests.validation";
import { checkRoles } from "../../middlewares/checkRole";
import { UPDATE_REDEEM_VALIDATION } from "../redeem/redeem.validation";

const router = Router();

router.get(
  "/findAll",
  checkRoles(["64484df4224bdffff93bc8c8"]),
  FINDALL_REQUEST_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const result = await requestsService.findAllRequests(filter, []);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/find/:id",
  checkRoles(["64484df4224bdffff93bc8c8", "64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_REQUEST_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await requestsService.findRequest(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update/:id",
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  UPDATE_REQUEST_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await requestsService.updateRequest(
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
  checkRoles(["64484dfc224bdffff93bc8ca"]),
  FIND_DELETE_REQUEST_VALIDATION,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await requestsService.deleteRequest(req.params.id);
      res.send(new RESPONSE_HANDLER(result));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
