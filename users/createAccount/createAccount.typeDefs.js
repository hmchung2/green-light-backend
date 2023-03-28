import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    createAccount(
      username: String!
      password: String!
      sex: String!
      interestingSex: String!
      age: Int!
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
    ): MutationResponse!
  }
`;
