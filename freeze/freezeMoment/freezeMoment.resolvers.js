import client from "../../client";
import { calculateDistance, protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    freezeMoment: protectedResolver(
      async (_, { lat, lon, maxD }, { loggedInUser }) => {
        const freezeCounts = await client.freeze.count({
          where: {
            freezerId: loggedInUser.id,
          },
        });

        if (freezeCounts >= 5) {
          return {
            ok: false,
            error: "You can't create more than 5 freeze",
          };
        }

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
            user: {
              select: {
                id: true,
              },
            },
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

        const userList = filteredLocations.map((user) => user.user);

        await client.freeze.create({
          data: {
            freezerId: loggedInUser.id,
            freezedUsers: {
              connect: userList,
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
