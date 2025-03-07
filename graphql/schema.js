const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLID
} = require('graphql');

const resolvers = require('./resolvers'); 

// DataItem Type
const DataItemType = new GraphQLObjectType({
  name: 'DataItem',
  fields: () => ({
    id: { type: GraphQLID },
    unit: { type: GraphQLString },
    time: { type: GraphQLString },
    value: { type: GraphQLFloat },
    create_at_bi: { type: GraphQLString }
  })
});

// DataResponse Type
const DataResponseType = new GraphQLObjectType({
  name: 'DataResponse',
  fields: () => ({
    totalData: { type: GraphQLInt },
    totalPages: { type: GraphQLInt },
    currentPage: { type: GraphQLInt },
    data: { type: new GraphQLList(DataItemType) }
  })
});

// Root Query Type
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // 📌 API: ดึงข้อมูลทั้งหมด (Pagination)
    getAllData: {
      type: DataResponseType,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve: resolvers.getAllData // ⬅️ ดึงข้อมูลทั้งหมด
    },
    
    // 📌 API: ดึงข้อมูลตาม ID
    getDataByvalue: {
      type: new GraphQLList(DataItemType),
      args: {
        value: { type: GraphQLString }
      },
      resolve: resolvers.getDataByvalue // ⬅️ ดึงข้อมูลตาม value
    }
  }
});

// Export GraphQL Schema
module.exports = new GraphQLSchema({
  query: RootQuery
});