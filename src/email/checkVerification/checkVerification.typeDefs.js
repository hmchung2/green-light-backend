import {gql} from "graphql-tag";

export default gql`
  type Query {
    checkVerification(email: String!, code: String!): VerificationResult!
  }

  type VerificationResult {
    ok: Boolean!
    error: String
  }
`;
