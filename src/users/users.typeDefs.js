import { gql } from "graphql-tag";

export default gql`
  type User {
    id: Int!
    username: String!
    sex: String!
    interestingSex: String!
    interestingAge: Int
    birthDay: String!
    phoneNo: String!
    password: String!
    instaUsername: String
    email: String
    following: [User]
    followers: [User]
    avatar: String
    photos: [Photo]
    location: Location
    introduction: String
    createdAt: String!
    updatedAt: String!
    isFollowing: Boolean!
    userType: String!
    userStatus: String
  }

  # type Query {
  #   Users: [User]
  # }
`;
