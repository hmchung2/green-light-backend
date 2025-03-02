import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),

    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),

    lastMessage: ({ id }) =>
        client.message.findFirst({
          where: { roomId: id },
          orderBy: { createdAt: "desc" }, // ✅ Get the latest message only
          include: { user: true }, // ✅ Include sender details
        }),

    // page 처리 필요 여기 테스트 코드 나중에 실험
    // messages: ({ id }, { lastMessageId }) =>
    //     client.message.findMany({
    //       where: { roomId: id },
    //       orderBy: { createdAt: "desc" },
    //       take: 20, // ✅ Pagination to prevent overloading
    //       ...(lastMessageId && { cursor: { id: lastMessageId }, skip: 1 }), // Pagination support
    //     }),

    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },


  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
