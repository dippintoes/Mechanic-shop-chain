export const REDEEM_RESPONSES = {
  CREATED: {
    message: "Record created successully",
    statusCode: 201,
  },
  REQUEST_NOT_FOUND: {
    message: "Request not found",
    statusCode: 404,
  },
  NO_REQUESTS: {
    message: "No rewards recived by shop owner",
    statusCode: 404,
  },
  NO_MATCH: {
    message: "No matching records found.",
    statusCode: 400,
  },
  UPDATE_SUCCESSFULL: {
    message: "redeem request updated successfully",
    statusCode: 201,
  },
  DELETE_SUCCESSFULL: {
    message: "redeem request deletion is successfull",
    statusCode: 410,
  },
};
