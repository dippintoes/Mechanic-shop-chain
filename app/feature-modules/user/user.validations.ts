import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const FINDALL_USERS_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const RUD_USERS_VALIDATION = [
  param("id").isString().withMessage("id parameter is necessary"),
  validate,
];

export const VALIDATE_REVENUE = [
  body("amount")
    .isNumeric()
    .notEmpty()
    .withMessage("ValidatedAmount must be entered"),
  param("shopid").isString().notEmpty().withMessage("Shopid is required"),
  validate,
];
