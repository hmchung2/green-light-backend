import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeRooms: protectedResolver(async (_, __, { loggedInUser }) => {
      const rooms = await client.room.findMany({
        where: {
          users: { some: { id: loggedInUser.id } },
        },
      });
      return rooms;
    }),
  },
};
