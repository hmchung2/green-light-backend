import client from "../../client";
// import crypto from "crypto";
import { sendEmail } from "../../shared/email.utils";

export default {
    Mutation: {
        sendVerification: async (_, { email, forSignup }) => {
            const existingUser = await client.user.findUnique({ where: { email } });
            console.log("existingUser", existingUser);

            // todo 개발 끝나고 주석 취소
            // if (forSignup && existingUser) {
            //     console.log("failed 1");
            //     return { ok: false, error: "This email is already in use." };
            // }

            if (!forSignup && !existingUser) {
                console.log("failed 2");
                return { ok: false, error: "No user found with this email." };
            }

            // const code = crypto.randomBytes(16).toString("hex");
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

            await client.emailVerification.upsert({
                where: { email },
                update: { code, expiresAt },
                create: { email, code, expiresAt },
            });

            try {
                const result = await sendEmail(
                    email,
                    "Your Verification Code",
                    `Your verification code is: ${code}`
                );
                console.log("Email send result:", result);
            } catch (error) {
                console.error("Email failed to send:", error);
                return { ok: false, error: "Failed to send email. Please try again." };
            }

            return { ok: true };
        },
    },
};
