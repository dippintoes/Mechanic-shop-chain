import mongoose, { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import ratingsRepo from "./ratings.repo";
import { IRating } from "./ratings.types";
import { RATING_RESPONSES } from "./ratings.responses";
import { generatePipeline } from "../../utility/generatePipeline";
import userServices from "../user/user.services";
import shopServices from "../shop/shop.services";

const createRating = async (rating: IRating) => {
  const record = await ratingsRepo.create(rating);
  return { ...RATING_RESPONSES.CREATED, record };
};

const findRating = async (id: string) => {
  const record = await ratingsRepo.findOne({
    _id: new mongoose.mongo.ObjectId(id),
    isDeleted: false,
  });
  if (!record) throw RATING_RESPONSES.NOT_FOUND;
  return record;
};

const findAllRatings = async (query: Object) => {
  const pipeline: PipelineStage[] = generatePipeline(query);
  const records = await ratingsRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $group: {
        _id: "$shop_id",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "shops",
        localField: "_id",
        foreignField: "_id",
        as: "shop_details",
      },
    },
    {
      $project: {
        _id: 0,
        "shop_details.shop_name": 1,
        count: 1,
      },
    },
    ...pipeline,
  ]);
  if (records.length === 0) throw RATING_RESPONSES.NO_RATINGS;
  return records;
};

const findMyRatings = async (query: Object, id: string) => {
  const stages: PipelineStage[] = [];

  const user = await userServices.findUser({
    _id: new mongoose.mongo.ObjectId(id),
  });

  const shop = await shopServices.findShop({ "shop_keeper.name": user.name });

  const Condition: PipelineStage = {
    $match: { shop_id: shop?._id },
  };

  const project: PipelineStage = {
    $project: {
      rating: 1,
    },
  };

  stages.push(Condition);
  stages.push(project);

  const pipeline: PipelineStage[] = generatePipeline(query);

  const records = await ratingsRepo.aggregate([
    {
      $match: { isDeleted: false },
    },
    ...stages,
    ...pipeline,
  ]);

  if (records.length === 0) throw RATING_RESPONSES.NO_RATINGS;
  return records;
};

const updateRating = async (id: string, update: UpdateQuery<IRating>) => {
  await ratingsRepo.update(
    { _id: new mongoose.mongo.ObjectId(id), isDeleted: false },
    update
  );
  return RATING_RESPONSES.UPDATE_SUCCESSFULL;
};

const deletRating = async (id: string) => {
  await ratingsRepo.update(
    { _id: new mongoose.mongo.ObjectId(id) },
    { isDeleted: true }
  );
  return RATING_RESPONSES.DELETE_SUCCESSFULL;
};

export default {
  createRating,
  findRating,
  findAllRatings,
  findMyRatings,
  updateRating,
  deletRating,
};
