import client from "../client";

export default {
  User: {
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
  },
};
