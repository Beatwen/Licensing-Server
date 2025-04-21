export interface User {
  id: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export interface License {
  id: string;
  licenseKey: string;
  status: 'active' | 'inactive' | 'expired';
  activatedAt?: string;
  expiresAt?: string;
  type: 'free' | 'basic' | 'pro' | 'trial';
  price?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}

export interface PurchaseResponse {
  success: boolean;
  licenseKey: string;
  message: string;
}

export interface ActivationResponse {
  success: boolean;
  message: string;
  license: License;
}