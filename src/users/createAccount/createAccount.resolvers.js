import client from "../../client";
import bcrypt from "bcrypt";
import { uploadToS3 } from "../../shared/s3.utils";

export default {
  Mutation: {
    createAccount: async (
      _,
      {
        username,
        password,
        sex,
        interestingSex,
        birthDay,
        phoneNo,
        email,
        instaUsername,
        avatar,
      }
    ) => {
      try {

        const orConditions = [];
    
        if (username) {
          orConditions.push({ username });
        }
        if (email) {
          orConditions.push({ email });
        }
        console.log("whereClause : ", orConditions);
        const existingUser = await client.user.findFirst({
          where: {
            OR: orConditions,
          },
        });
        // todo 개발 끝나고 주석 취소
        // if (existingUser) {
        //   return { ok: false, error: "This username or email is already taken." };
        // }


        const bcyrptPassword = await bcrypt.hash(password, 10);
 
        const avatarUrl = avatar
          ? await uploadToS3(avatar, username, "avatars")
          : null;

        await client.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              username,
              sex,
              interestingSex,
              birthDay,
              phoneNo,
              // email, //  todo 🔹 개발 중에는 optional → unique constraint 충돌 방지용으로 주석 처리
              instaUsername,
              password: bcyrptPassword,
              userType: "P",
              userStatus: "M",
              ...(avatarUrl && { avatar: avatarUrl }),
            },
          });

          await tx.location.create({
            data: {
              user: {
                connect: { id: newUser.id },
              },
            },
          });

          await tx.alarm.create({
            data: {
              userId: newUser.id,
              msg: `🎉 Welcome, ${username}!`,
              detail : "Thank you for joining us. Let's start your journey!",
              alarmType: 0,
              read: false,
              seen: false,
            },
          });
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
  Query: {
    validCreateAccount: async (
      _,
      { username, instaUsername, phoneNo, email, nextPage }
    ) => {
      console.log("happening");
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
      console.log("existingUser : ", existingUser);
      if (existingUser) {
        return { ok: false, error: "existing user" };
      } else {
        return { ok: true, nextPage: nextPage };
      }
    },
  },
};
