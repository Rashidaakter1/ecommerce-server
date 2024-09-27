// import { Request, Response } from "express";
// import { User } from "./auth.model";
// import { TUser } from "./auth.interface";

// const createUserIntoDb = async (payload: TUser) => {
//   const result = await User.create(payload);
//   return result;
// };
// const getUserFromDb = async () => {
//   const result = await User.find();
//   return result;
// };
// const getSingleUserFromDb = async (id: string) => {
//   const result = await User.findById(id);
//   return result;
// };
// const updateUserIntoDb = async (id: string, payload: TUser) => {
//   const result = await User.findByIdAndUpdate(id, payload, { new: true });
//   return result;
// };
// const deleteUserFromDb = async (id: string) => {
//   const result = await User.findByIdAndUpdate(
//     id,
//     {
//       isDeleted: true,
//     },
//     { new: true }
//   );
//   return result;
// };

// export const AuthServices = {
//   createUserIntoDb,
//   getUserFromDb,
//   deleteUserFromDb,
//   updateUserIntoDb,
//   getSingleUserFromDb,
// };
