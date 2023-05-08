import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    showAlarms: protectedResolver(async (_, __, { loggedInUser }) => {
      const alarms = await client.alarm.findMany({
        where: {
          user: {
            id: loggedInUser.id,
          },
        },
        select: {
          msg: true,
          read: true,
        },
      });

      const alarmResult = {
        alarms,
      };

      return alarmResult;
    }),
  },
};
