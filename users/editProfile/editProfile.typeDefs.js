import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    editProfile(
      username: String
      sex: String
      interestingSex: String
      password: String
      avatar: String
      email: String
      instaUsername: String
    ): MutationResponse!
  }
`;
