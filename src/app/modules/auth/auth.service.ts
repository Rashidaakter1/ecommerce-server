import { Request, Response } from "express";
import { User } from "./auth.model";
import { TUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import jwt from "jsonwebtoken";
import createToken from "./auth.utlis";

const createUserIntoDb = async (payload: TUser) => {
  const { email, password, ...remainingData } = payload;
  const isEmailExist = await User.findOne({ email: email });
  if (isEmailExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }
  // hashed password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt__saltRound)
  );
  const user = {
    ...remainingData,
    email,
    password: hashedPassword,
  };
  const result = await User.create(user);
  return result;
};

const getUserFromDb = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDb = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUserIntoDb = async (id: string, payload: TUser) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteUserFromDb = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

const loginUserIntoDb = async (payload: Partial<TUser>) => {
  const { email, password } = payload;
  const isEmailExist = await User.findOne({ email: email });
  if (!isEmailExist) {
    throw new AppError(httpStatus.FORBIDDEN, "Email is not exists");
  }

  const isDeleted = isEmailExist.isDeleted;
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }
  // check the password is matches the password
  const hashedPassword = isEmailExist.password;
  const validPassword = bcrypt.compare(password as string, hashedPassword);
  if (!validPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not match");
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: isEmailExist.email,
    name: isEmailExist.name.firstName,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt__access__token as string,
    config.jwt__access__expires__in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt__refresh__token as string,
    config.jwt__refresh__expires__in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};
export const AuthServices = {
  createUserIntoDb,
  getUserFromDb,
  deleteUserFromDb,
  updateUserIntoDb,
  getSingleUserFromDb,
  loginUserIntoDb,
};
