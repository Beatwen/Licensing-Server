import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { DeviceAttributes, DeviceCreationAttributes } from "../types/deviceTypes";
import License from "./licensing";

class Device extends Model<DeviceAttributes, DeviceCreationAttributes>
  implements DeviceAttributes {
  public id!: number;
  public licenseId!: number;
  public deviceId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelizeInstance: typeof sequelize) {
    Device.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        licenseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        deviceId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        tableName: "devices",
        timestamps: true,
      }
    );
  }

  static associate() {
    Device.belongsTo(License, {
      foreignKey: "licenseId",
      as: "license",
      onDelete: "CASCADE",
    });
  }
}

export default Device;
