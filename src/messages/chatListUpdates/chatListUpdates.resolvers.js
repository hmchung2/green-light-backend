import { withFilter } from "graphql-subscriptions";
import pubsub from "../../pubsub";
import client from "../../client";
import { CHAT_LIST_UPDATES } from "../../constant";


export default {
    Subscription: {
        chatListUpdates: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(CHAT_LIST_UPDATES),
                ({ chatListUpdates }, _, { loggedInUser }) => {
                    return chatListUpdates.id === loggedInUser.id
                }
            ),
        },
    },
};

// pubsub.publish(CHAT_LIST_UPDATES, {
//     chatListUpdates: { roomId, lastMessage: message }
// }).catch(err => console.error("Error publishing chatListUpdates:", err));
