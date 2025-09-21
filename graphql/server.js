require('dotenv').config();
const { app, server } = require('./app');

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.PORT_GRAPHQL || 4000;
  app.listen(port, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
