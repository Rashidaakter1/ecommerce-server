import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../auth/auth.model";

const createCategoryIntoDb = async (user: JwtPayload, payload: TCategory) => {
  console.log(user);
  const userId = await User.findOne({ email: user.email });
  const category = await Category.create({ ...payload, createdBy: userId });
  return category;
};
const getCategoryFromDb = async (query: Record<string, unknown>) => {
  const queryCategory = new QueryBuilder(
    Category.find()
      .select("-isDeleted")
      .populate("createdBy products", { name: 1, title: 1 }),
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
    .populate("createdBy products", { name: 1, title: 1 });
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

  const { products, ...remainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (products && Array.isArray(products)) {
    await Category.findByIdAndUpdate(id, {
      $addToSet: { products: { $each: products } },
    });
  }

  const category = await Category.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });

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
