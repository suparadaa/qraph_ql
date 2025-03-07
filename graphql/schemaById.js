const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql");
const resolvers = require("./resolvers");

const DataItemType = new GraphQLObjectType({
  name: "DataItem",
  fields: () => ({
    id: { type: GraphQLID },
    unit: { type: GraphQLString },
    time: { type: GraphQLString },
    value: { type: GraphQLFloat },
    create_at_bi: { type: GraphQLString },
  }),
});

// ✅ Schema สำหรับ `/graphql/id`
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getDataById: {
      type: DataItemType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: resolvers.getDataById,
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
