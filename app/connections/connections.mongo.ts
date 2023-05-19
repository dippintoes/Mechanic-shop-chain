import { connect } from "mongoose";

export const connectToMongo = async () => {
  try {
    const { MONGO_CONNECTION } = process.env;
    await connect(MONGO_CONNECTION || "");
    console.log("connected to MongoDb");
    return true;
  } catch (e) {
    console.log("Could not connect to database");
    throw { message: "Could not connect to database" };
  }
};
