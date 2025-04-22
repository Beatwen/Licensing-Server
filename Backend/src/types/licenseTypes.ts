import { Optional } from "sequelize";
import Device from "../models/device";


export interface LicensingAttributes {
    id: number;
    userId: number;
    type: string;
    licenseKey: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    devices?: Device[];
    }

export type LicensingCreationAttributes = Optional<LicensingAttributes, "id">;