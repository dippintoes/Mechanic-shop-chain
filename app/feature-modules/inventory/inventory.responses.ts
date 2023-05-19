export const INVENTORY_RESPONSES = {
  CREATED: {
    message: "Record created successully",
    statusCode: 201,
  },
  NOT_FOUND: {
    message: "Part not found",
    statusCode: 404,
  },
  NO_PARTS: {
    message: "No spare parts present in the database",
    statusCode: 404,
  },
  NO_MATCH: {
    message: "No matching records found.",
    statusCode: 400,
  },
  UPDATE_SUCCESSFULL: {
    message: "inventory updated successfully",
    statusCode: 201,
  },
  DELETE_SUCCESSFULL: {
    message: "Spare part item deletion successfully",
    statusCode: 410,
  },
};
