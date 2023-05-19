export const REQUEST_RESPONSES = {
  CREATED: {
    message: "Record created successully",
    statusCode: 201,
  },
  REQUEST_NOT_FOUND: {
    message: "request with given id not found",
    statusCode: 404,
  },
  NO_REQUESTS: {
    message: "No requests present in the database",
    statusCode: 404,
  },
  NO_MATCH: {
    message: "No matching records found.",
    statusCode: 400,
  },
  UPDATE_SUCCESSFULL: {
    message: "spare part request updated successfully",
    statusCode: 201,
  },
  DELETE_SUCCESSFULL: {
    message: "spare part request deletion is successfull",
    statusCode: 410,
  },
};
