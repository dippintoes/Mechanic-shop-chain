export const SALES_RESPONSES = {
  CREATED: {
    message: "Record created successully",
    statusCode: 201,
  },
  No_Sales: {
    message: "No sales present in the database",
    statusCode: 404,
  },
  NOT_FOUND: {
    message: "sale not found in the database",
    statusCode: 404,
  },
  OUT_OF_STOCK: {
    message: "Mentioned products are outOfStock",
    statusCode: 404,
  },
  RNNING_LOW: {
    message: "Sorry! Running low on selected item",
    statusCode: 404,
  },
  NO_MATCH: {
    message: "No matching records found.",
    statusCode: 400,
  },
  UPDATE_SUCCESSFULL: {
    message: "sale updated successfully",
    statusCode: 201,
  },
  DELETE_SUCCESSFULL: {
    message: "sale deletion is successfull and inventory is returned",
    statusCode: 410,
  },
};
