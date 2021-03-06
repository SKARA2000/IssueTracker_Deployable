const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
require('dotenv').config();

const GraphQLDate = require('./graphql_date.js');
const { setAboutMessage, getMessage } = require('./about.js');
const issue = require('./issue.js');

const resolvers = {
    Query: {
      about: getMessage,
      issueList: issue.list,
      issue: issue.get,
      issueCount: issue.counts,
    },
    Mutation: {
      setAboutMessage: setAboutMessage,
      issueAdd: issue.add,
      issueUpdate: issue.update,
      issueDelete: issue.delete,
    },
    GraphQLDate,
  };

  const server = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
    formatError: (error) => {
      console.log(error);
      return error;
    },
    playground: true,
    introspection: true,
  });

  function installHandler(app){
    const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
    console.log(`CORS Setting: ${enableCors}`);
    let cors;
    if(enableCors){
      const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
      const methods = 'POST';
      cors = { origin, methods };
    }else {
      cors = 'false';
    }
    server.applyMiddleware({ app, path: '/graphql', cors });
  }
  
  module.exports = { installHandler };
  