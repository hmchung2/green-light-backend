import { gql } from "graphql-tag";

export default gql`
  type seeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }

  type Query {
    seeFollowers(page: Int!): seeFollowersResult!
  }
`;
