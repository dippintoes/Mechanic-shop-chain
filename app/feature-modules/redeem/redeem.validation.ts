import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_REDEEM_VALIDATION = [
  body("reward").isString().notEmpty().withMessage("reward field must exist"),
  validate,
];

export const FINDALL_REDEEM_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_REDEEM_VALIDATION = [
  body("reward").optional().isString().withMessage("Reward is necessary filed"),
  body("shop_id")
    .optional()
    .isString()
    .withMessage("shop id is necessary filed"),
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const FIND_DELETE_REDEEM_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];
