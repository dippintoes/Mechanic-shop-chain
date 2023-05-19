import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_SALE_VALIDATION = [
  body("sold_products")
    .isArray()
    .notEmpty()
    .withMessage("sold_products field must exist"),
  body("sold_products.*.part")
    .isString()
    .withMessage("part in sold_products must exist"),
  body("sold_products.*.qty")
    .isNumeric()
    .withMessage("qty in sold_products must exist"),
  validate,
];

export const FINDALL_SALE_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_SALE_VALIDATION = [
  body("name")
    .optional()
    .isString()
    .withMessage("name of SALE is necessary filed"),
  body("points").optional().isNumeric(),
  body("sold_products.*.part")
    .optional()
    .isString()
    .withMessage("part in sold_products must exist"),
  body("sold_products.*.qty")
    .optional()
    .isNumeric()
    .withMessage("qty in sold_products must exist"),
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const FIND_DELETE_SALE_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];
