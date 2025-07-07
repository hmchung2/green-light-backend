import client from "../../client";


export default {
    Query: {
        checkVerification: async (_, { email, code }) => {
            try {
                const record = await client.emailVerification.findUnique({
                    where: { email },
                });

                if (!record) {
                    return { ok: false, error: "please send the verification code" };
                }

                if (record.expiresAt < new Date()) {
                    return { ok: false, error: "Verification code has expired." };
                }

                if (record.code !== code) {
                    return { ok: false, error: "Invalid verification code." };
                }

                return { ok: true, error: null };
            } catch (error) {
                console.error("checkVerification error:", error);
                return { ok: false, error: "Could not verify the code." };
            }
        },
    },
};
