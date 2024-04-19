import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    readAlarms: protectedResolver(async (_, { page = 1 }, { loggedInUser }) => {
      const pageSize = 10;
      const alarms = await client.alarm.findMany({
        where: {
          userId: loggedInUser.id,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });
      return alarms;
    }),
  },
};
