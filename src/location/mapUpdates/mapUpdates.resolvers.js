import { withFilter } from "graphql-subscriptions";
import pubsub from "../../pubsub";
import client from "../../client";
import { NEW_LOCATION } from "../../constant";
import { calculateDistance } from "../../users/users.utils";

export default {
  Subscription: {
    mapUpdates: {
      subscribe: async (root, args, context, info) => {
        console.log("mapUpdates");
        const location = await client.location.findFirst({
          where: {
            userId: args.userId,
          },
          select: { userId: true },
        });

        if (!location) {
          throw new Error("No Location to be updated");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_LOCATION),
          async (
            { mapUpdates },
            { userId, generalLat, generalLon },
            { loggedInUser }
          ) => {
            if (
              Math.abs(generalLat - mapUpdates.lat) < 0.05 &&
              Math.abs(generalLon - mapUpdates.lon) < 0.05
            ) {
              if (mapUpdates.user.sex != loggedInUser.sex) {
                const userDetailLocation = await client.location.findUnique({
                  where: {
                    userId,
                  },
                  select: { lat: true, lon: true },
                });

                if (
                  calculateDistance(
                    userDetailLocation.lat,
                    userDetailLocation.lon,
                    mapUpdates.lat,
                    mapUpdates.lon
                  ) < 150
                ) {
                  return true;
                }
              }
            }

            return false;
          }
        )(root, args, context, info);
      },
    },
  },
};
