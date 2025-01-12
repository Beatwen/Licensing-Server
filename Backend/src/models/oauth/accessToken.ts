import { Model, DataTypes, Sequelize } from "sequelize";
import Client from "../client";
import { User } from "../user";

export class AccessToken extends Model {
  public accessToken!: string;
  public accessTokenExpiresAt!: Date;
  public clientId!: number;
  public oauthClientId!: string;   
  public userId!: number;

  static initialize(sequelize: Sequelize) {
    AccessToken.init(
      {
        accessToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        accessTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
        tableName: "access_tokens",
      }
    );
  }

  static associate() {
    AccessToken.belongsTo(Client, { foreignKey: "clientId", onDelete: 'CASCADE' });
    AccessToken.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });
  }
}

export default AccessToken;