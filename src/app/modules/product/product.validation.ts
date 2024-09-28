import { z } from "zod";

const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(3, { message: "The character must be above 3" }),
    price: z.number().positive(),
    quantity: z.number().int().nonnegative(),
    brand: z.string().min(3, { message: "The character must be above 3" }),
    model: z.string().min(3, { message: "The character must be above 3" }),
    operatingSystem: z.enum(["ios", "android", "other"]),
    storageCapacity: z.number().int().positive(),
    screenSize: z.number().positive(),
    cameraQuality: z.object({
      main: z.number().int().positive(),
      front: z.number().int().positive(),
    }),
    batteryCapacity: z.number().int().positive(),
    additionalFeatures: z.object({
      isWaterResistant: z.boolean(),
      has5G: z.boolean(),
      hasWirelessCharging: z.boolean(),
    }),
    isDeleted: z.boolean().optional(),
  }),
});

export const ProductValidations = {
  createProductValidation,
};
