import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import User from "./user";
import { LicensingAttributes, LicensingCreationAttributes } from "../types/licenseTypes";

class License extends Model<LicensingAttributes, LicensingCreationAttributes> implements LicensingAttributes {
  public id!: number;
  public userId!: number;
  public licenseKey!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelizeInstance: typeof sequelize) {
    License.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        licenseKey: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "active",
        },
      },
      {
        sequelize: sequelizeInstance,
        tableName: "licenses",
      }
    );
  }
}

// Exporter une fonction pour définir les relations
export const defineRelations = () => {
  User.hasMany(License, { foreignKey: "userId" });
  License.belongsTo(User, { foreignKey: "userId" });
};

export default License;
