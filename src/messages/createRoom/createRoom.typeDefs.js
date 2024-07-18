import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    createRoom(targetId: Int!): MutationResponse!
  }
`;
