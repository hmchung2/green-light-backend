import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    uploadPhotos(ufiles: [Upload]!): [Photo]!
  }
`;
