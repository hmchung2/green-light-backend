import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      {
        username,
        password,
        sex,
        interestingSex,
        age,
        phoneNo,
        email,
        instaUsername,
      }
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
              {
                phoneNo,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error(
            "This usernam or instaUsername or email or phoneNo  is already taken."
          );
        }
        const bcyrptPassword = await bcrypt.hash(password, 10);

        await client.$transaction([
          client.user.create({
            data: {
              username,
              sex,
              interestingSex,
              age,
              phoneNo,
              email,
              instaUsername,
              password: bcyrptPassword,
              userType: "P",
              userStatus: "M",
            },
          }),
          client.location.create({
            data: {
              user: {
                connect: { username },
              },
            },
          }),
        ]);

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
  Query: {
    validCreateAccount: async (
      _,
      { username, instaUsername, phoneNo, email }
    ) => {
      const whereClause = [];
      if (username) {
        whereClause.push({ username });
      }
      if (email) {
        whereClause.push({ email });
      }
      if (instaUsername) {
        whereClause.push({ instaUsername });
      }
      if (phoneNo) {
        whereClause.push({ phoneNo });
      }

      if (whereClause.length == 0) {
        throw new Error("No parameter");
      }

      const existingUser = await client.user.findFirst({
        where: {
          OR: whereClause,
        },
      });
      if (existingUser) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    },
  },
};
