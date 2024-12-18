import { Optional } from "sequelize";


export interface LicensingAttributes {
    id: number;
    userId: number;
    type: string;
    licenseKey: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    }

export type LicensingCreationAttributes = Optional<LicensingAttributes, "id">;