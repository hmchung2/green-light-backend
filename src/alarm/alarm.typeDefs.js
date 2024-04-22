import { gql } from "graphql-tag";

export default gql`
  type Alarm {
    id: Int!
    userId: Int!
    user: User!
    read: Boolean!
    seen: Boolean!
    msg: String!
    detail: String
    alarmType: Int!
    targetId: Int
    alarmImg: String
    createdAt: String!
    updatedAt: String!
  }

  type Alarms {
    id: Int!
    new: Boolean!
    alarms: [Alarm!]!  # Ensures an empty list instead of null
  }
`;
