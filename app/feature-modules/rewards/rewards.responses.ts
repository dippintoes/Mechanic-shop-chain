export const REWARDS_RESPONSES = {
  CREATED: {
    message: "Record created successully",
    statusCode: 201,
  },
  REWARD_NOT_FOUND: {
    message: "Reward not found",
    statusCode: 404,
  },
  NO_REWARDS: {
    message: "No rewards present in the database",
    statusCode: 404,
  },
  NO_MATCH: {
    message: "No matching records found.",
    statusCode: 400,
  },
  UPDATE_SUCCESSFULL: {
    message: "rewards request updated successfully",
    statusCode: 201,
  },
  DELETE_SUCCESSFULL: {
    message: "rewards deletion is successfull",
    statusCode: 410,
  },
  LOCKED_REWARD: {
    message: "This reward is currently locked. Earn more points to redeem this",
    statusCode: 400,
  },
};
