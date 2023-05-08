import client from "../../client";
import { NEW_LOCATION } from "../../constant";
import pubsub from "../../pubsub";
import { calculateDistance, protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    updateLocation: protectedResolver(
      async (_, { lat, lon }, { loggedInUser }) => {
        try {
          // Update the location record in the database
          const location = await client.location.update({
            where: {
              // Define the conditions to find the location record to update
              // For example, you could use the user ID to identify the location of the user
              userId: loggedInUser.id,
            },
            data: {
              // Update the lat and lon fields with the new values
              lat,
              lon,
            },
          });

          // const locations = await client.location.findMany({
          //   where: {
          //     AND: [
          //       {
          //         lat: {
          //           gte: lat - 0.05,
          //           lte: lat + 0.05,
          //         },
          //         lon: {
          //           gte: lon - 0.05,
          //           lte: lon + 0.05,
          //         },
          //         user: {
          //           sex: loggedInUser.sex === "M" ? "F" : "M",
          //           userType: "P",
          //           userStatus: "M",
          //         },
          //       },
          //     ],
          //   },
          //   select: {
          //     userId: true,
          //     user: true,
          //     lat: true,
          //     lon: true,
          //   },
          // });

          // const filteredLocations = locations
          //   .map((location) => {
          //     return {
          //       ...location,
          //       vectorDistance: calculateDistance(
          //         location.lat,
          //         location.lon,
          //         lat,
          //         lon
          //       ),
          //     };
          //   })
          //   .filter((location) => {
          //     return location.vectorDistance <= maxD ? maxD : 150;
          //   });

          pubsub.publish(NEW_LOCATION, {
            mapUpdates: { ...location, user: { ...loggedInUser } },
          });
          return { ok: true };
        } catch (e) {
          console.log("error : ", e);
          return { ok: false, error: e };
        }
      }
    ),
  },
};
