import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_RATING_VALIDATION = [
  body("rating").isNumeric().withMessage("rating field is necessary"),
  body("shop_id").isString().withMessage("shopid parameter is necessary"),
  validate,
];

export const FINDALL_RATING_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_RATING_VALIDATION = [
  body("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating are necessary filed"),
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const FIND_DELETE_RATING_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];
