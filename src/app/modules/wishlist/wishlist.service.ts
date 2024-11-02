import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";

import { User } from "../auth/auth.model";
import { Product } from "../product/product.model";
import { ObjectId } from "mongodb";
import { TWishlist } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";

const createWishlistIntoDb = async (user: JwtPayload, payload: TWishlist) => {
  const userId = await User.findOne({ email: user?.email });

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
  }

  const result = await Wishlist.create({
    ...payload,
    user: userId,
    totalItems: payload.products.reduce((acc, item) => acc + item.quantity, 0),
  });

  return result;
};
const geTWishlistFromDb = async (query: Record<string, unknown>) => {
  const queryWishlist = new QueryBuilder(
    Wishlist.find()
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
  const result = await queryWishlist.modelQuery;
  return result;
};
const getSingleWishlistFromDb = async (id: string) => {
  const isWishlistExists = await Wishlist.findById(id);
  if (!isWishlistExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wishlist is  not found");
  }
  const wishlist = await Wishlist.findById(id)
    .where({
      isDeleted: { $ne: true },
    })
    .populate("user", { _id: 1, name: 1, email: 1, role: 1 });
  return Wishlist;
};
const getSingleUserCartFromDb = async (userData: JwtPayload) => {

  const wishlist = await Wishlist.aggregate([
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
        _id: "$productDetails._id",
        product: { $first: "$productDetails" },
        quantity: { $sum: "$products.quantity" },
       
      },
    },
    {
      $addFields: {
        "product.quantity": "$quantity",
      },
    },
    {
      $group: {
        _id: null,
        products: { $push: "$product" },
        totalItems: { $sum: "$quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        products: 1,
        totalItems: 1,
      },
    },
  ]);

  return wishlist;
};

const deleteProductFromUserFromCart = async (
  userData: JwtPayload,
  productId: string
) => {
  const updatedCart = await Wishlist.aggregate([
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

const updateWishlistFromDb = async (
  id: string,
  payload: Partial<TWishlist>
) => {
  const isWishlistExists = await Wishlist.findById(id);
  if (!isWishlistExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wishlist is not found");
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

  const result = await Wishlist.findByIdAndUpdate(
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

const deleteWishlistFromDb = async (id: string) => {
  const isWishlistExists = await Wishlist.findById(id);
  if (!isWishlistExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wishlist is  not found");
  }
  const wishlist = await Wishlist.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );
  return wishlist;
};

export const WishlistServices = {
  createWishlistIntoDb,
  geTWishlistFromDb,
  getSingleWishlistFromDb,
  updateWishlistFromDb,
  deleteWishlistFromDb,
  getSingleUserCartFromDb,
  deleteProductFromUserFromCart,
};
