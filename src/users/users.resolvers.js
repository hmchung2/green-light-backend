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
    isFollower: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          id,
          following: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      });
      return Boolean(exists);
    },
    followersCount: async ({ id }) => {
      return client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      });
    },
    followingCount: async ({ id }) => {
      return client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      });
    },
  },
};
