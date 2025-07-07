import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    sendVerification(email: String!, forSignup: Boolean!): MutationResponse!
  }
`;
