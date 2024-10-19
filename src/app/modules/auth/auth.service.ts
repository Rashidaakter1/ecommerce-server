import { Request, Response } from "express";
import { User } from "./auth.model";
import { TUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import createToken from "./auth.utlis";
import sendEmail from "../../utils/sendEmail";

const createUserIntoDb = async (payload: TUser) => {
  const { email, password, ...remainingData } = payload;
  console.log(payload);
  const isEmailExist = await User.findOne({ email: email });
  if (isEmailExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const user = {
    ...remainingData,
    email,
    password,
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
  console.log(hashedPassword);
  const validPassword = await bcrypt.compare(
    password as string,
    hashedPassword
  );
  console.log(validPassword, "valid password");
  if (!validPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not match");
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: isEmailExist.email,
    name: isEmailExist.name.firstName,
    role: isEmailExist.role,
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

const refreshTokenIntoDB = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt__refresh__token as string
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const { email, iat } = decoded;

  // check if the user is authenticated

  const isUserExist = await User.findOne({ email: email });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check user is deleted or not
  const isDeleted = isUserExist.isDeleted;
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }
  // if the password is changed, update the password after jwt validation
  if (
    isUserExist.passwordChangedAt &&
    User.isJWTIssuedBBeforePasswordChange(
      isUserExist.passwordChangedAt,
      iat as number
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: isUserExist.email,
    name: isUserExist.name.firstName,
    role: isUserExist.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt__access__token as string,
    config.jwt__access__expires__in as string
  );

  return {
    accessToken,
  };
};

const changePasswordIntoDb = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const { email } = user;
  // check if the user is authenticated

  const isUserExist = await User.findOne({ email: email });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check user is deleted or not
  const isDeleted = isUserExist.isDeleted;
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  // check the password is matches the password
  const hashedOldPassword = isUserExist?.password;
  const validPassword = await bcrypt.compare(
    payload?.oldPassword,
    hashedOldPassword
  );
  if (!validPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not match");
  }

  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt__saltRound)
  );

  const res = await User.findOneAndUpdate(
    { email: email },
    {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
    }
  );
  return null;
};

const forgetPasswordDb = async (userId: string) => {
  // check user is exist or not
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check user is deleted or not
  const isDeleted = isUserExist.isDeleted;
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const jwtPayload = {
    email: isUserExist.email,
    name: isUserExist.name.firstName,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt__access__token as string,
    "10m"
  );

  const resultUILink = `${config.reset__ui__link}?id=${isUserExist._id}&token=${resetToken}`;
  console.log(resultUILink, isUserExist.email);
  sendEmail(isUserExist.email, resultUILink);
};

const resetPasswordDb = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  // check user is exist or not
  const isUserExist = await User.findById(payload.id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check user is deleted or not
  const isDeleted = isUserExist.isDeleted;
  if (isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const decoded = jwt.verify(
    token,
    config.jwt__access__token as string
  ) as JwtPayload;
  if (isUserExist.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is not matched");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt__saltRound)
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      //   name: decoded.name,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
};
export const AuthServices = {
  createUserIntoDb,
  getUserFromDb,
  deleteUserFromDb,
  updateUserIntoDb,
  getSingleUserFromDb,
  loginUserIntoDb,
  refreshTokenIntoDB,
  changePasswordIntoDb,
  forgetPasswordDb,
  resetPasswordDb,
};
