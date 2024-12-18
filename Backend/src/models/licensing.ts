import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { User } from "./user";
import { LicensingAttributes } from "../types/licenseTypes";
import Device from "./device"; // Importez le modèle Device

interface LicenseCreationAttributes
  extends Omit<LicensingAttributes, "id"> {}

class License extends Model<LicensingAttributes, LicenseCreationAttributes> {
  public id!: number;
  public type!: string;
  public userId!: number;
  public licenseKey!: string;
  public status!: string;

  static initialize(sequelizeInstance: typeof sequelize) {
    License.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        type: { type: DataTypes.STRING, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        licenseKey: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
      },
      { sequelize: sequelizeInstance, tableName: "licenses", timestamps: true }
    );
  }

  static associate() {
    License.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE", // Supprime la licence si l'utilisateur est supprimé
    });

    License.hasMany(Device, {
      foreignKey: "licenseId",
      as: "devices",
      onDelete: "CASCADE", // Supprime les appareils si la licence est supprimée
    });
  }
}

export default License;
