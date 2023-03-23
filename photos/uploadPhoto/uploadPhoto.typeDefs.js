import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    uploadPhoto(ufile: Upload): Photo
  }
`;
