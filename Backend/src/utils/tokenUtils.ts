import crypto from "crypto";

export function generateConfirmationToken(): string {
    return crypto.randomBytes(32).toString("hex");
}
