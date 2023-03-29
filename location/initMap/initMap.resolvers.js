import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    initMap: protectedResolver(async (_, { lat, lon }, { loggedInUser }) => {
      const location = await client.location.update({
        where: {
          userId: loggedInUser.id,
        },
        data: {
          lat,
          lon,
        },
      });

      pubsub.publish(NEW_LOCATION, {
        mapUpdates: { ...location, user: { ...loggedInUser } },
      });

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
              user: {
                sex: loggedInUser.sex === "M" ? "F" : "M",
                userType: "P",
                userStatus: "M",
              },
            },
          ],
        },
        select: {
          userId: true,
          user: true,
          lat: true,
          lon: true,
        },
      });
      const filteredLocations = locations
        .map((location) => {
          return {
            ...location,
            vectorDistance: calculateDistance(
              location.lat,
              location.lon,
              lat,
              lon
            ),
          };
        })
        .filter((location) => {
          return location.vectorDistance <= maxD ? maxD : 150;
        });
      return filteredLocations;
    }),
  },
};
