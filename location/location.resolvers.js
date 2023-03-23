import client from "../client";

export default {
  Location: {
    user: ({ userId }) =>
      client.location.findUnique({ where: { userId } }).user(),

    isFollowing: async ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          id: loggedInUser.id,
          following: {
            some: {
              userId,
            },
          },
        },
      });
      return Boolean(exists);
    },
    isMe: async ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
