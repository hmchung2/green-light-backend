import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    seeAlarms: protectedResolver(async (_, __, { loggedInUser }) => {
      await client.alarm.updateMany({
        where: {
          userId: loggedInUser.id,
          seen: false
        },
        data: { seen: true },
      });

      // to make all false -> just for testing
      // await client.alarm.updateMany({
      //   data: { seen: false },
      // });

      return {
        ok: true,
      };
    }),
  },
};
