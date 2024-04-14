import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    unfollowUser(id: Int!): MutationResponse!
  }
`;
