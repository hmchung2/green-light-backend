import { gql } from "graphql-tag";

export default gql`
  scalar Upload

  type Mutation {
    editProfile(
      username: String
      sex: String
      interestingSex: String
      password: String
      avatar: Upload
      email: String
      instaUsername: String
    ): MutationResponse!
  }
`;
