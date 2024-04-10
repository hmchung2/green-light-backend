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
    isMe: ({ id }, _, { loggedInUser }) => {
      // Check if the loggedInUser exists and if their id matches the id of the user being resolved
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
  },
};
