import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, password, sex, interestingSex, email, instaUsername }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
              {
                instaUsername,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error(
            "This usernam or instaUsername or email is already taken."
          );
        }
        const bcyrptPassword = await bcrypt.hash(password, 10);

        await client.user.create({
          data: {
            username,
            sex,
            interestingSex,
            email,
            instaUsername,
            password: bcyrptPassword,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          error: e,
        };
      }
    },
  },
};
