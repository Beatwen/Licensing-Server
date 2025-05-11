export interface UserAttributes {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    emailConfirmed: boolean;
    confirmationToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isAdmin: boolean;
  }
  
  export interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt"> {}
  