const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require("../graphql/schema");
const schemaById = require("../graphql/schemaById");
const { connectDB }  = require("../data/connectDatabase");
const basicAuth = require("./auth");
const router = express.Router()
connectDB();

router.use('/graphql', basicAuth, (req, res) => {
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { res }, // ⬅️ ส่ง response object ไปใน context
    customFormatErrorFn: (err) => {
      if (err.extensions?.code === "BAD_REQUEST") {
        res.status(400);
      } else {
        res.status(500);
      }
      return { message: err.message };
    }
  })(req, res);
});


/*
router.use(
  "/graphql/id",
  basicAuth,
  graphqlHTTP({
    schema: schemaById,
    graphiql: true,
    customFormatErrorFn: (err) => {
      return { message: err.message };
    }
  })
);*/


module.exports = router;

