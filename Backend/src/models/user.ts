import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes } from "../types/userTypes";
import License from "./licensing";
import bcrypt from "bcrypt";

export interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt" | "emailConfirmed"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public userName!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public emailConfirmed!: boolean;
  public confirmationToken!: string | null;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        firstName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        emailConfirmed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false, 
        },
        confirmationToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "users",
        hooks: {
          beforeCreate: async (user) => {
            if (!user.userName) {
              user.userName = user.email;
            };
            if (user.password) {
              const saltRounds = 10;
              user.password = await bcrypt.hash(user.password, saltRounds);
            };
          },
          beforeUpdate: async (user) => {
            if (user.password && user.changed("password")) {
              const saltRounds = 10;
              user.password = await bcrypt.hash(user.password, saltRounds);
            };
          }
        },
      }
    );

  }
  static associate() {
    User.hasMany(License, {
      foreignKey: "userId", // La clé étrangère dans la table `licenses`
      as: "licenses",       // Doit correspondre à l'alias utilisé dans les requêtes
      onDelete: "CASCADE",  // Suppression en cascade des licences associées
    });
  }  
}
