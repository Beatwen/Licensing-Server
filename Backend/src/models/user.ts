import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes } from "../types/userTypes";
import License from "./licensing";
import bcrypt from "bcrypt";
import Client from "./client";
import RefreshToken from "./oauth/refreshToken";
import AccessToken from "./oauth/accessToken";
import Device from "./device";

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
  public isAdmin!: boolean;
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
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
              console.log(user.password);
              user.password = await bcrypt.hash(user.password, saltRounds);
              console.log(user.password);
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
    User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
    User.hasMany(AccessToken, { foreignKey: 'userId', as: 'accessTokens', onDelete: 'CASCADE' });
    User.hasMany(Device, { foreignKey: 'userId', as: 'devices', onDelete: 'CASCADE' });
    User.hasMany(License, { foreignKey: 'userId', as: 'licenses', onDelete: 'CASCADE' });
    User.hasMany(Client, { foreignKey: 'userId', as: 'clients', onDelete: 'CASCADE' });
  }
}
