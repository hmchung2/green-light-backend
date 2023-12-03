import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeRoom: protectedResolver(async (_, { id }, { loggedInUser }) => {
      console.log("seeRoom");

      const result = await client.room.findFirst({
        where: {
          id,
          users: {
            some: { id: loggedInUser.id },
          },
        },
        orderBy: {
          id: "asc", // or 'desc' for descending order
        },
      });
      console.log("seeRoom result : ", result);
      return result;
    }),
  },
};
