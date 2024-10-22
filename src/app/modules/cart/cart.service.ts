import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TShoppingCart } from "./cart.interface";
import { ShoppingCart } from "./cart.model";
import { User } from "../auth/auth.model";
import { Product } from "../product/product.model";
import { ObjectId } from "mongodb";

const createShoppingCartIntoDb = async (
  user: JwtPayload,
  payload: TShoppingCart
) => {
  const userId = await User.findOne({ email: user?.email });

  let totalPrice = 0;
  for (const item of payload.products) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }

    // Check if enough stock is available
    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for product ${product.title}`);
    }

    // Reduce stock
    product.stock = product.stock - item.quantity;
    await product.save();

    // Calculate total price for the cart
    totalPrice = totalPrice + product.price * item.quantity;
  }

  const cart = await ShoppingCart.create({
    ...payload,
    user: userId,
    totalPrice,
    totalItems: payload.products.reduce((acc, item) => acc + item.quantity, 0),
    updatedAt: Date.now(),
  });

  return cart;
};
const geTShoppingCartFromDb = async (query: Record<string, unknown>) => {
  const queryShoppingCart = new QueryBuilder(
    ShoppingCart.find()
      .select("-isDeleted")
      .populate("user", { _id: 1, name: 1, email: 1, role: 1 })
      .where({
        isDeleted: { $ne: true },
      }),
    query
  )
    .search(["name", "email"])
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
    .populate("user", { _id: 1, name: 1, email: 1, role: 1 });
  return shoppingCart;
};
const getSingleUserCartFromDb = async (userData: JwtPayload) => {
  const shoppingCart = await ShoppingCart.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $match: {
        "userDetails.email": userData.email,
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: null,
        products: { $push: "$productDetails" },
        totalItems: { $sum: "$totalItems" },
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        products: 1,
        totalItems: 1,
        totalPrice: 1,
      },
    },
  ]);

  console.log(shoppingCart);
  return shoppingCart;
};

const deleteProductFromUserFromCart = async (
  userData: JwtPayload,
  productId: string
) => {
  const updatedCart = await ShoppingCart.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },

    {
      $project: {
        products: {
          $filter: {
            input: "$products",
            as: "product",
            cond: { $ne: ["$$product.product", new ObjectId(productId)] },
          },
        },
        totalItems: { $sum: "$products.quantity" },
        totalPrice: {
          $reduce: {
            input: "$products",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                { $multiply: ["$$this.quantity", "$$this.price"] },
              ],
            },
          },
        },
      },
    },
  ]);

  console.log(updatedCart);
  if (!updatedCart.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No cart found or product not in cart."
    );
  }

  return updatedCart[0];
};

const updateShoppingCartFromDb = async (
  id: string,
  payload: Partial<TShoppingCart>
) => {
  const isShoppingCartExists = await ShoppingCart.findById(id);
  if (!isShoppingCartExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "ShoppingCart is not found");
  }

  const { products, ...remainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (products && Array.isArray(products)) {
    let updatedTotalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      // Check if enough stock is available
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for product ${product.title}`);
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      // Calculate total price for the cart
      updatedTotalPrice += product.price * item.quantity;
    }

    // Set updated total price and total items in the shopping cart
    modifiedUpdatedData.totalPrice = updatedTotalPrice;
    modifiedUpdatedData.totalItems = products.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
  }

  const result = await ShoppingCart.findByIdAndUpdate(
    id,
    {
      ...modifiedUpdatedData,
      updatedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  return result;
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
  return shoppingCart;
};

export const ShoppingCartServices = {
  createShoppingCartIntoDb,
  geTShoppingCartFromDb,
  getSingleShoppingCartFromDb,
  updateShoppingCartFromDb,
  deleteShoppingCartFromDb,
  getSingleUserCartFromDb,
  deleteProductFromUserFromCart,
};
