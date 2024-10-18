import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCategoryIntoDb = async (user: JwtPayload, payload: TCategory) => {
  const category = await Category.create({ ...payload, createdBy: user._id });
  return category;
};
const getCategoryFromDb = async (query: Record<string, unknown>) => {
  const queryCategory = new QueryBuilder(
    Category.find()
      .select("-isDeleted")
      .populate("createdBy", { _id: 1, username: 1, email: 1, role: 1 }),
    query
  )
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryCategory.modelQuery;
  return result;
};
const getSingleCategoryFromDb = async (id: string) => {
  const isCategoryExists = await Category.findById(id);
  if (!isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category is  not found");
  }
  const category = await Category.findById(id)
    .where({
      isDeleted: { $ne: true },
    })
    .populate("createdBy", { _id: 1, username: 1, email: 1, role: 1 });
  return category;
};
const updateCategoryFromDb = async (
  id: string,
  payload: Partial<TCategory>
) => {
  const isCategoryExists = await Category.findById(id);
  if (!isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category is  not found");
  }
  const category = await Category.findByIdAndUpdate(id, payload, { new: true });
  return category;
};

const deleteCategoryFromDb = async (id: string) => {
  const isCategoryExists = await Category.findById(id);
  if (!isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category is  not found");
  }
  const category = await Category.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );
  return category;
};

export const CategoryServices = {
  createCategoryIntoDb,
  getCategoryFromDb,
  getSingleCategoryFromDb,
  updateCategoryFromDb,
  deleteCategoryFromDb,
};
