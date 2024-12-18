export interface DeviceAttributes {
    id: number;
    licenseId: number;
    deviceId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface DeviceCreationAttributes
    extends Omit<DeviceAttributes, "id" | "createdAt" | "updatedAt"> {}
  