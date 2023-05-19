import { body } from "express-validator";
import { validate } from "../../utility/validator";

export const CREATE_USER_VALIDATION = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("email").isString().notEmpty().withMessage("Email is required"),
  body("password").optional(),
  body("role").optional(),
  validate,
];

export const LOGIN_USER_VALIDATION = [
  body("email").isString().notEmpty().withMessage("Email is required"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 3 }),
  validate,
];
