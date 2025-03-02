import { gql } from "graphql-tag";

export default gql`
  type Subscription {
    chatListUpdates: ChatListUpdate
  }

  type ChatListUpdate {
    roomId: Int!
    id: Int!
    lastMessage: Message
  }
`;
