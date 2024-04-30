import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    readAlarm: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const alarm = await client.alarm.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          read: true,
        },
      });
      if (!alarm) {
        return {
          ok: false,
          error: "Message Not Found",
        };
      } else if (alarm.read) {
        return {
          ok: false,
          error: "Alarm Already Read",
        };
      }
      await client.alarm.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });

      return { ok: true };
    }),
  },
};
