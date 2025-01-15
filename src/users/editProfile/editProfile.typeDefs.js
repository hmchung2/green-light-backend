import { gql } from "graphql-tag";

export default gql`
  scalar Upload
  
  input PhotoInput {
    id: Int
    originalId: Int
    originalFileUrl : String
    file: Upload
  }

  type Mutation {
    editProfile(
      username: String
      description: String
      gender: String
      birthDay: String
      avatar: Upload
      photos: [PhotoInput]!
    ): MutationResponse!
  }
`;
