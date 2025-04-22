import { JwtPayload } from 'jsonwebtoken';
import { User } from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            deviceId?: string;
            userKey?: string;
        }
    }
}

export {}; 