import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    deleteFreeze(id: Int!): MutationResponse!
  }
`;
