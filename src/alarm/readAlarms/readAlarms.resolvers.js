import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    readAlarms: protectedResolver(async (_, { cursor }, { loggedInUser }) => {
      const pageSize = 13;
      const alarms = await client.alarm.findMany({
        where: {
          userId: loggedInUser.id,
        },
        take: pageSize + 1, // Fetch one extra item to check if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: {
          createdAt: "desc",
        },
      });
      const hasNextPage = alarms.length > pageSize;
      const alarmsToReturn = hasNextPage ? alarms.slice(0, -1) : alarms;
      const result = {
        id : 1,
        alarms : alarmsToReturn,
        pageInfo : {
          endCursor: alarmsToReturn.length > 0 ? alarmsToReturn[alarmsToReturn.length - 1].id : null,
          hasNextPage
        }
      }
      return result;
    }),
  },
};
