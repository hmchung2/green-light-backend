import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    followUser(id: Int!): MutationResponse!
  }
`;
