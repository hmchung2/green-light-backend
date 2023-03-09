import { createWriteStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          username,
          sex,
          interestingSex,
          password,
          avatar,
          email,
          instaUsername,
        },
        { loggedInUser }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          const { file } = await avatar;
          const { filename, createReadStream } = file;
          console.log(filename);
          console.log(avatar);
          console.log("createReadStream type", typeof createReadStream);
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFilename}`;
        }
        return { ok: true };
      }
    ),
  },
};
