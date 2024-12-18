import License from "../models/licensing";
import { sendConfirmationEmail } from "./emailUtils";
const license = License.build({
    type: "free",
    licenseKey: "123456",
    status: "active",
    userId: 1,
});
(async () => {
    try {
        await sendConfirmationEmail("c_bouserez@hotmail.com", "exemple_token_123",license);
        console.log("Email envoyé avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
    }
})();
