
export type TProduct = {
  name: string;
  price: number;
  quantity: number;
  releaseDate: Date;
  brand: string;
  model: string;
  operatingSystem: "iOS" | "Android" | "Other";
  storageCapacity: number; // in GB
  screenSize: number; // in inches
  cameraQuality: {
    main: number; // in megapixels
    front: number; // in megapixels
  };
  batteryCapacity: number; // in mAh
  additionalFeatures: {
    isWaterResistant: boolean;
    has5G: boolean;
    hasWirelessCharging: boolean;
  };
  isDeleted: boolean;
};

