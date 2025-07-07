import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    readAlarms: protectedResolver(async (_, { offset }, { loggedInUser }) => {
      console.log("offset -> ", offset);
      const pageSize = 10;
      const alarms = await client.alarm.findMany({
        take: pageSize, // Fetch one extra item to check if there's a next page
        skip: offset,
        where: {
          userId: loggedInUser.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const result = {
        id: 1,
        endPage: alarms.length < 10,
        result: alarms,
      };
      return {
        id: 1,
        endPage: alarms.length < 10,
        result: alarms,
      };
    }),
  },
};

//       const hasNextPage = alarms.length > pageSize;
//       const alarmsToReturn = hasNextPage ? alarms.slice(0, -1) : alarms;
//       const result = {
//         id : 1,
//         alarms : alarmsToReturn,
//         pageInfo : {
//           endCursor: alarmsToReturn.length > 0 ? alarmsToReturn[alarmsToReturn.length - 1].id : null,
//           hasNextPage
//         }
//       }
//       return result;
//     }),
//   },
// };
