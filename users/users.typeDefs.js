export default `#graphql
  type User {
    id: Int!
    username: String!
    password: String!
    instaUsername: String
    email: String
    following: [User]
    followers: [User]
    avatar: String
    createdAt: String!
    updatedAt: String!
  }

  type Query{
    Users : [User]
  }

`;
