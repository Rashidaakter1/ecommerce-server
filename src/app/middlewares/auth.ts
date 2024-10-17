import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/auth/auth.model";
import { TUserRole } from "../modules/auth/auth.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt__access__token as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    console.log(decoded);
    const { email, iat, role } = decoded;

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

    //Check the roles
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
