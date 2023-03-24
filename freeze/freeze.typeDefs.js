import { gql } from "graphql-tag";

export default gql`
  type freeze {
    id: Int!
    freezerId: Int!
    freezedUsers: [User]!
    createdAt: String!
    updatedAt: String!
  }
`;
