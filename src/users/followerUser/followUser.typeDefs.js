import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    followUser(id: Int!): FollowUserResponse!
  }

  type FollowUserResponse {
    id: Int
    ok: Boolean!
    error: String
    mutualFollow: Boolean
  }
`;
