import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    createAlarm(msg: String!): MutationResponse!
  }
`;
