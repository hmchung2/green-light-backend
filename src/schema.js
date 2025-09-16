import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";  // ✅ default import

const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

const typeDefs = mergeTypeDefs([
  ...loadedTypes,
  `scalar Upload` // <- 여기 추가
]);

const resolvers = mergeResolvers([
  ...loadedResolvers,
  { Upload: GraphQLUpload } // <- 여기 추가
]);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
