export interface UserAttributes {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    emailConfirmed: boolean;
    confirmationToken: string | null;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt"> {}
  