export default `#graphql
    type MutationResponse{
        ok : Boolean!
        error :  String
        id: Int
    }
    type PageInfo{
        endCursor: Int
        hasNextPage: Boolean!
    }
`;
