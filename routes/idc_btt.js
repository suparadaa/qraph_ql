const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require("../graphql/schema");
const { connectDB }  = require("../data/connectDatabase");
const basicAuth = require("./auth");
const router = express.Router();

connectDB();

router.use(
  '/graphql',basicAuth,
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);
module.exports = router;


