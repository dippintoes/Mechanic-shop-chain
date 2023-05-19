import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_REQUEST_VALIDATION = [
  body("requests")
    .isArray()
    .notEmpty()
    .withMessage("requests field must exist"),
  body("requests.*.part").isString().withMessage("part in request must exist"),
  body("requests.*.qty").isNumeric().withMessage("qty in request must exist"),
  validate,
];

export const FINDALL_REQUEST_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_REQUEST_VALIDATION = [
  body("requests")
    .optional()
    .isArray()
    .withMessage("requests is necessary filed"),
  body("requests.*.part").optional().isString(),
  body("requests.*.qty").optional().isNumeric(),
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const FIND_DELETE_REQUEST_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const APPROVE_REQUESTS = [
  param("reqid").isString().notEmpty().withMessage("Request Id is required"),
  query("ids")
    .notEmpty()
    .withMessage("Required when selecting multiple requests"),
  validate,
];
