import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deleteAlarm: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const alarm = await client.alarm.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!alarm) {
        return {
          ok: false,
          error: "alarm not Found",
        };
      } else if (alarm.userId !== loggedInUser.id) {
        console.log("loggedInUser.id : ", loggedInUser.id);
        console.log("alarm.userId : ", alarm.userId);
        return {
          ok: false,
          error: "Not Authorized",
        };
      }

      await client.alarm.delete({
        where: {
          id,
        },
      });

      return {
        ok: true,
      };
    }),
  },
};
