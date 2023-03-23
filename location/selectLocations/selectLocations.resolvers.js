import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    selectLocations: async (_, { lat, lon }, { loggedInUser }) => {
      console.log("ok");
      return client.location.findMany({
        where: {
          AND: [
            {
              lat: {
                gte: lat - 0.05,
                lte: lat + 0.05,
              },
              lon: {
                gte: lon - 0.05,
                lte: lon + 0.05,
              },
            },
          ],
        },
      });
    },
  },
};
