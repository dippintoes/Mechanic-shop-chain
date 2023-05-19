import mongoose, { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import userRepo from "./user.repo";
import { IUser } from "./user.types";
import { USER_RESPONSES } from "./user.responses";
import { IRequest } from "../requests/requests.types";
import requestsService from "../requests/requests.service";
import { ISale } from "../sales/sales.types";
import salesService from "../sales/sales.service";
import shopServices from "../shop/shop.services";
import { IRedeem } from "../redeem/redeem.types";
import redeemService from "../redeem/redeem.service";
import { generatePipeline } from "../../utility/generatePipeline";
import ratingsServices from "../ratings/ratings.services";
import { RatingModel } from "../ratings/ratings.schema";
import rewardsServices from "../rewards/rewards.services";
import { REWARDS_RESPONSES } from "../rewards/rewards.responses";

const createUser = async (user: IUser) => {
  const newUser = await userRepo.create(user);
  return newUser;
};

const requestPart = async (id: string, request: IRequest) => {
  const user = await userRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
  });
  if (!user) throw USER_RESPONSES.NOT_FOUND;
  const shop = await shopServices.findShop({
    "shop_keeper.email": user.email,
  });
  id = shop._id.toString();
  const record = await requestsService.createRequest(id, request);
  return { ...USER_RESPONSES.REQUEST_SUCCESSFULL, record };
};

const redeemReward = async (id: string, request: IRedeem) => {
  const record = await redeemService.redeemReward(id, request);
  return record;
};

const approveReward = async (id: string) => {
  const record = await rewardsServices.approveReward(id);
  console.log(record);
  if (record.modifiedCount === 0) throw REWARDS_RESPONSES.NO_MATCH;
  return USER_RESPONSES.APPROVED_REDEEM_SUCCESSFULL;
};

const approveRequest = async (reqid: string, objectIdArray: any) => {
  await requestsService.approveRequest(reqid, objectIdArray);
  return USER_RESPONSES.APPROVED_REQUEST_SUCCESSFULL;
};

const createSale = async (id: string, sale: ISale) => {
  const user = await userRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
  });
  if (!user) throw USER_RESPONSES.NOT_FOUND;
  const shop = await shopServices.findShop({
    "shop_keeper.email": user.email,
  });
  id = shop._id.toString();
  const record = await salesService.createSale(id, sale);
  return { ...USER_RESPONSES.CREATED, record };
};

const findUser = async (filter: FilterQuery<IUser>) => {
  const user = await userRepo.findOne({ ...filter, isDeleted: false });
  if (!user) throw USER_RESPONSES.NOT_FOUND;
  return user;
};

const validateRevenue = (id: string, amount: number) =>
  shopServices.validateRevenue(id, amount);

const updateUser = async (
  filter: FilterQuery<IUser>,
  update: UpdateQuery<IUser>
) => {
  const updatedUser = await userRepo.update(filter, update);
  if (!updatedUser) throw USER_RESPONSES.NOT_FOUND;
  return USER_RESPONSES.UPDATE_SUCCESSFULL;
};

const rate = async (shopid: string, rating: number) => {
  await ratingsServices.createRating({
    shop_id: new mongoose.mongo.ObjectId(shopid),
    rating: rating,
  });
  const averageRatings = await RatingModel.aggregate([
    {
      $group: {
        _id: new mongoose.mongo.ObjectId(shopid),
        rating: {
          $avg: "$rating",
        },
      },
    },
  ]);
  await shopServices.updateShop(
    { _id: new mongoose.mongo.ObjectId(shopid) },
    { $set: { ratings: averageRatings[0].rating.toFixed(2) } }
  );
  return USER_RESPONSES.THANKS;
};

const findAll = async (query: any) => {
  const pipeline: PipelineStage[] = generatePipeline(query);
  console.log(pipeline);
  const records = await userRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...pipeline,
  ]);
  if (!records) throw USER_RESPONSES.NO_MATCH;
  return records;
};

const deleteUser = async (filter: FilterQuery<IUser>) => {
  const record = await userRepo.update(filter, { isDeleted: true });
  if (!record) throw USER_RESPONSES.NOT_FOUND;
  return USER_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createUser,
  approveRequest,
  approveReward,
  requestPart,
  createSale,
  validateRevenue,
  findUser,
  findAll,
  updateUser,
  deleteUser,
  redeemReward,
  rate,
};
