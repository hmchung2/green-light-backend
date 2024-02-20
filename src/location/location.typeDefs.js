import { gql } from "graphql-tag";

export default gql`
  type Location {
    userId: Int!
    user: User!
    lat: Float
    lon: Float
    isFollowing: Boolean!
    isMe: Boolean!
    vectorDistance: Float
  }
  type LocationRoom{
    id : Int!
    locations : [Location!]
  }
`;
