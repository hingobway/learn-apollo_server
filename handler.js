import serverless from 'serverless-http';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import err from './src/utils/err.js';
import types from './src/schema/types.js';
import queries from './src/schema/queries.js';
import resolvers from './src/schema/resolvers.js';

import ProjectSource from './src/sources/ProjectSource.js';
import ClientSource from './src/sources/ClientSource.js';

if (process.env.IS_OFFLINE) {
  dotenv.config();
}

const app = express();

const server = new ApolloServer({
  typeDefs: [types, queries],
  resolvers,
});
await server.start();

app.use(cors());
app.use(express.json());
app.use(err);

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: () => ({
      sources: {
        project: new ProjectSource(),
        client: new ClientSource(),
      },
    }),
  })
);

app.use((_, res) => res.err(404, 'NOT_FOUND'));

const handler = serverless(app);

export { handler };
