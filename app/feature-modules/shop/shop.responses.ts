export const SHOP_RESPONSES = {
  CREATED: {
    message: "Record created successully",
    statusCode: 201,
  },
  NOT_FOUND: {
    message: "Shop not found in the database",
    statusCode: 404,
  },
  NO_SHOPS: {
    message: "No shops present in the database",
    statusCode: 404,
  },
  NO_MATCH: {
    message: "No matching records found.",
    statusCode: 400,
  },
  UPDATE_SUCCESSFULL: {
    message: "shop updated successfully",
    statusCode: 201,
  },
  DELETE_SUCCESSFULL: {
    message: "shop deletion is successfull",
    statusCode: 410,
  },
  SHOP_VALIDATED_SUCCESSFULLY: {
    message:
      "Shop Revenue validated successfully, now you can redeem your rewards",
    statusCode: 201,
  },
  UNAUTHORIZED_USER: {
    message: "Unauthorized user",
    statusCode: 401,
  },
};
