import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    updateLocation(userId: Int!): MutationResponse
  }
`;
