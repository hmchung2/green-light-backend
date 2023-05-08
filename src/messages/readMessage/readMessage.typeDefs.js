import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    readMessage(id: Int!): MutationResponse!
  }
`;
