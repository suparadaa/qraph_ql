const express = require("express");
const userRouter = require("./routes/idc_btt");  
const { graphqlHTTP } = require("express-graphql");
const Schema = require("./graphql/schema");
const Resolvers = require("./graphql/resolvers");
const app = express();  

app.use('/api', userRouter); 
app.listen(3000, () => {
  console.log('Server running on port 3000');
});


module.exports = app;