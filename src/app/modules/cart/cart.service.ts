import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TShoppingCart } from "./cart.interface";
import { ShoppingCart } from "./cart.model";

const createShoppingCartIntoDb = async (user: JwtPayload, payload: TShoppingCart) => {
  const cart = await ShoppingCart.create({ ...payload, createdBy: user._id });
  return ShoppingCart;
};
const geTShoppingCartFromDb = async (query: Record<string, unknown>) => {
  const queryShoppingCart = new QueryBuilder(
    ShoppingCart.find()
      .select("-isDeleted")
      .populate("createdBy", { _id: 1, username: 1, email: 1, role: 1 }),
    query
  )
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryShoppingCart.modelQuery;
  return result;
};
const getSingleShoppingCartFromDb = async (id: string) => {
  const isShoppingCartExists = await ShoppingCart.findById(id);
  if (!isShoppingCartExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "ShoppingCart is  not found");
  }
  const shoppingCart = await ShoppingCart.findById(id)
    .where({
      isDeleted: { $ne: true },
    })
    .populate("createdBy", { _id: 1, username: 1, email: 1, role: 1 });
  return ShoppingCart;
};
const updateShoppingCartFromDb = async (
  id: string,
  payload: Partial<TShoppingCart>
) => {
  const isShoppingCartExists = await ShoppingCart.findById(id);
  if (!isShoppingCartExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "ShoppingCart is  not found");
  }
  const shoppingCart = await ShoppingCart.findByIdAndUpdate(id, payload, { new: true });
  return ShoppingCart;
};

const deleteShoppingCartFromDb = async (id: string) => {
  const isShoppingCartExists = await ShoppingCart.findById(id);
  if (!isShoppingCartExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "ShoppingCart is  not found");
  }
  const shoppingCart = await ShoppingCart.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );
  return ShoppingCart;
};

export const ShoppingCartServices = {
  createShoppingCartIntoDb,
  geTShoppingCartFromDb,
  getSingleShoppingCartFromDb,
  updateShoppingCartFromDb,
  deleteShoppingCartFromDb,
};
