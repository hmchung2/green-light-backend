import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    createAlarm: protectedResolver(async (_, { msg }, { loggedInUser }) => {
      await client.alarm.create({
        data: {
          msg,
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
