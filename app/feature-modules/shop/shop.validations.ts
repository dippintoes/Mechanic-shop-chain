import { body, query, param } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_SHOP_VALIDATION = [
  body("shop_name")
    .isString()
    .notEmpty()
    .withMessage("Shop Name field must exist"),
  body("location")
    .isString()
    .notEmpty()
    .withMessage("Location field must exist"),
  body("shop_keeper").notEmpty().withMessage("shop_keeper field must exist"),
  body("inventory")
    .isArray()
    .notEmpty()
    .withMessage("inventory field must exist"),
  body("inventory.$.part")
    .isString()
    .notEmpty()
    .withMessage("inventory part id must exist"),
  body("inventory.$.qty")
    .isNumeric()
    .notEmpty()
    .withMessage("inventory part quantity must exist"),
  validate,
];

export const FINDALL_SHOP_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_SHOP_VALIDATION = [
  body("shop_name")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Shop Name field must exist"),
  body("location")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Location field must exist"),
  body("shop_keeper.name")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("shop_keeper name field must exist"),
  body("shop_keeper.email")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("shop_keeper email field must exist"),
  body("inventory.$.part")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("inventory part id must exist"),
  body("inventory.$.qty")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("inventory part quantity must exist"),
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const FIND_DELETE_SHOP_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const MONTHLY_REVENUE = [
  query("shopId").isString().notEmpty().withMessage("shopid is required"),
  query("startDate").optional().isDate(),
  param("endDate").optional().isDate(),
  validate,
];

// export const FIND_SHOP_SPECIFIC_DETAILS = [
//   param("shopid")
//     .isString()
//     .notEmpty()
//     .withMessage("shop is required parameter "),
//   validate,
// ];
