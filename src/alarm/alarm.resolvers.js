import client from "../client";

export default {
  Alarm: {
    user: ({ id }) => client.alarm.findUnique({ where: { id } }).user(),
  },

  Alarms: {
    unreadTotal: ({ alarms }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        console.log("not logged in so unabled to count");
        return 0;
      }
      // const unreadCount = alarms.reduce((count, alarm) => {
      //   if (!alarm.read) {
      //     count++;
      //   }
      //   return count;
      // }, 0);

      const unreadCount = alarms.reduce((count, alarm) => {
        if (!alarm.read) {
          count++;
        }
        return count;
      }, 0);

      return unreadCount;
    },
  },
};
