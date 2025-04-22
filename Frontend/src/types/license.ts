import { Device } from "./types";

export interface License {
  id: number;
  licenseKey: string;
  status: string;
  type: string;
  userId: number;
  devices: Device[];
  activatedAt: string | null;
  expiresAt: string | null;
} 