import client from "../client";

export default {
  Location: {
    user: ({ userId }) =>
      client.location.findUnique({ where: { userId } }).user(),

    isFollowing: async ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        console.log("not logged in");
        return false;
      }
      console.log("userId : " + userId);
      console.log("loggedInUser : ", loggedInUser);

      const exist = await client.user.count({
        where: {
          id: loggedInUser.id,
          following: {
            some: {
              id: userId,
            },
          },
        },
      });
      return Boolean(exist);
    },

    isMe: async ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
};
