import { CreateWriteStreamOptions, CreateReadStreamOptions } from "fs/promises";
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
        return null;
      }
    ),
  },
};
