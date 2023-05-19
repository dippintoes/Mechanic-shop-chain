import { body, param, query } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_REWARD_VALIDATION = [
  body("name").isString().notEmpty().withMessage("Name field is required"),
  body("points").isNumeric().notEmpty().withMessage("Points field is required"),
  validate,
];

export const FINDALL_REWARD_VALIDATION = [
  query("sort").optional().isString().withMessage("sort field to sort"),
  query("limit").optional().isNumeric().withMessage("limit field to limit"),
  query("page").optional().isNumeric().withMessage("page field to paginate"),
  query("sortdir")
    .optional()
    .isNumeric()
    .withMessage("sortdir field to add direction to sort"),
  validate,
];

export const UPDATE_REWARD_VALIDATION = [
  body("name")
    .optional()
    .isString()
    .withMessage("name of reward is necessary filed"),
  body("points").optional().isNumeric(),
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const FIND_DELETE_REWARD_VALIDATION = [
  param("id")
    .isString()
    .isLength({ max: 24 })
    .withMessage("id parameter is necessary"),
  validate,
];

export const APPROVE_REWARDS = [
  param("reqid")
    .isString()
    .isLength({ max: 24 })
    .notEmpty()
    .withMessage("Request Id is required"),
  validate,
];
