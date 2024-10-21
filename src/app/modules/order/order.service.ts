import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";
import { User } from "../auth/auth.model";

const createOrderIntoDb = async (user: JwtPayload, payload: TOrder) => {
  const userId = await User.findOne({ email: user.email });
  const order = await Order.create({ ...payload, createdBy: userId });
  return order;
};

const getOrderFromDb = async (query: Record<string, unknown>) => {
  const queryOrder = new QueryBuilder(
    Order.find()
      .select("-isDeleted")
      .populate("createdBy", { _id: 1, username: 1, email: 1, role: 1 }),
    query
  )
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryOrder.modelQuery;
  return result;
};
const getSingleOrderFromDb = async (id: string) => {
  const isOrderExists = await Order.findById(id);
  if (!isOrderExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order is  not found");
  }
  const order = await Order.findById(id)
    .where({
      isDeleted: { $ne: true },
    })
    .populate("createdBy", { _id: 1, username: 1, email: 1, role: 1 });
  return order;
};
const updateOrderFromDb = async (id: string, payload: Partial<TOrder>) => {
  const isOrderExists = await Order.findById(id);
  if (!isOrderExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order is  not found");
  }
  const order = await Order.findByIdAndUpdate(id, payload, { new: true });
  return order;
};

const deleteOrderFromDb = async (id: string) => {
  const isOrderExists = await Order.findById(id);
  if (!isOrderExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order is  not found");
  }
  const order = await Order.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );
  return order;
};

export const orderServices = {
  createOrderIntoDb,
  getOrderFromDb,
  getSingleOrderFromDb,
  updateOrderFromDb,
  deleteOrderFromDb,
};
