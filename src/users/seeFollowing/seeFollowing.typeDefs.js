import { gql } from "graphql-tag";

export default gql`
  type seeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
    totalPages: Int
  }

  type Query {
    seeFollowing(page: Int!): seeFollowingResult!
  }
`;
