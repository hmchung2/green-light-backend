import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    selectLocations: protectedResolver(async (_, { lat, lon }) => {
      console.log("fetching nearby users :  " , lat , "  :  " , lon);
      const locations = await client.location.findMany({
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
      const locationRoom = {
        id: 1,
        locations: locations,
      };
      return locationRoom;
    }),
  },
};
