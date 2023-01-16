import { GraphQLError } from 'graphql';

const resolvers = {
  Query: {
    clients: (_, __, { sources: { client } }) => client.getClients(),
    client: (_, { id }, { sources: { client } }) => client.getClient(id),

    projects: (_, __, { sources: { project } }) => project.getProjects(),
    project: (_, { id }, { sources: { project } }) => project.getProject(id),
  },
  Mutation: {
    addClient: (_, args, { sources: { client } }) => client.addClient(args),
    deleteClient: (_, { id }, { sources: { client } }) =>
      client.deleteClient(id),

    addProject: async (_, args, { sources: { project, client } }) => {
      const c = await client.getClient(args.clientId);
      if (!c)
        throw new GraphQLError(`That client couldn't be found.`, {
          extensions: { code: 'RELATIONSHIP_FAILURE' },
        });
      args.status = args.status || 'NEW';
      return project.addProject(args);
    },
    updateProject: (_, args, { sources: { project } }) => {
      const id = args.id;
      delete args.id;
      return project.updateProject(id, args);
    },
    deleteProject: (_, { id }, { sources: { project } }) =>
      project.deleteProject(id),
  },

  Project: {
    client: ({ clientId }, _, { sources: { client } }) =>
      client.getClient(clientId),
  },
};

export default resolvers;
