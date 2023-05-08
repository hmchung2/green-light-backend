import { gql } from "graphql-tag";

export default gql`
  type Alarm {
    id: Int!
    userId: Int!
    user: User!
    read: Boolean!
    msg: String!
    createdAt: String!
    updatedAt: String!
  }

  type Alarms {
    unreadTotal: Int!
    alarms: [Alarm]
  }
`;
