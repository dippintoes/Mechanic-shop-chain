import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_INVENTORY_VALIDATION = [
  body("spare_part")
    .isString()
    .notEmpty()
    .withMessage("Spare part field must exist"),
  body("min_qty")
    .isNumeric()
    .notEmpty()
    .withMessage("Min_Qty field must exist"),
  body("price").isNumeric().notEmpty().withMessage("price field must exist"),
  body("isSpecial")
    .optional()
    .isBoolean()
    .notEmpty()
    .withMessage("Must specify if item is special"),
  body("points")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("points field must exist for special items"),
  validate,
];

export const FINDALL_PARTS_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_INVENTORY_VALIDATION = [
  body("spare_part")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Spare part field must exist"),
  body("min_qty")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("Min_Qty field must exist"),
  body("price")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("price field must exist"),
  body("isSpecial")
    .optional()
    .isBoolean()
    .notEmpty()
    .withMessage("Must specify if item is special"),
  body("points")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("points field must exist for special items"),
  validate,
];

export const FIND_DELETE_INVENTORY_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];
