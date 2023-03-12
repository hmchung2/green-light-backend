import client from "../client";

export default {
  Location: {
    user: ({ userId }) =>
      client.message.findUnique({ where: { userId } }).user(),
  },
};
