export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export type UserCreationAttributes = Omit<UserAttributes, "id">;
  