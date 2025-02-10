import { Model, DataTypes, Sequelize } from "sequelize";
import Client from "../client";
import { User } from "../user";

export class RefreshToken extends Model {
  public refreshToken!: string;
  public refreshTokenExpiresAt?: Date;
  public clientId!: number;
  public userId!: number;
  public oAuthClientId!: string; 
  public Client!: Client; 
  public User!: User; 

  static initialize(sequelize: Sequelize) {
      RefreshToken.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        refreshToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        refreshTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true, 
        },
        clientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Client,
            key: 'id'
          },
        },
        oauthClientId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id'
          },
        },
      },
      {
        sequelize,
        tableName: "refresh_tokens",
      }
    );
  }

  static associate() {
    RefreshToken.belongsTo(Client, { foreignKey: "clientId", onDelete: 'CASCADE' });
    RefreshToken.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });    
  }
}

export default RefreshToken;