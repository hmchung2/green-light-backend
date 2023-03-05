import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    createAccount(
      username: String!
      password: String!
      sex: String!
      interestingSex: String!
      email: String
      instaUsername: String
    ): MutationResponse
  }
`;
