import { gql } from "graphql-tag";

export default gql`
  type validResponse {
    ok: Boolean!
    error: String
    nextPage: String
  }

  type Mutation {
    createAccount(
      username: String!
      password: String!
      sex: String!
      interestingSex: String!
      birthDay: String!
      phoneNo: String!
      email: String
      instaUsername: String
    ): MutationResponse!
  }

  type Query {
    validCreateAccount(
      username: String
      instaUsername: String
      phoneNo: String
      email: String
      nextPage: String
    ): validResponse!
  }
`;
