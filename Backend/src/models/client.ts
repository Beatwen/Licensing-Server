import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user";
import AccessToken from "./oauth/accessToken";
import RefreshToken from "./oauth/refreshToken";

export interface ClientAttributes {
  id: number,
  clientOauthId: string, // Utiliser clientOauthId
  clientSecret: string,
  grants: string[],
  userId: number,
}

export interface ClientCreationAttributes 
  extends Omit<ClientAttributes, "id">{}

export class Client extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes {
      public id!: number;
      public clientOauthId!: string; // Utiliser clientOauthId
      public clientSecret!: string;
      public grants!: string[];
      public userId!: number;
    
      public readonly createdAt!: Date;
      public readonly updatedAt!: Date;

      static initialize(sequelize: Sequelize) {
          Client.init(
            {
              id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
              },
              clientOauthId: { // Utiliser clientOauthId
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
              },
              clientSecret: {
                type: DataTypes.STRING,
                allowNull: false,
              },
              grants: {
                type: DataTypes.ARRAY(DataTypes.STRING),
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
              tableName: "clients",
            }
          );
      }

      static associate() {
          Client.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });
          Client.hasMany(AccessToken, { foreignKey: "clientId", onDelete: 'CASCADE' });
          Client.hasMany(RefreshToken, { foreignKey: "clientId", onDelete: 'CASCADE' });
      }
}

export default Client;