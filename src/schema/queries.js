import { gql } from 'graphql-tag';

const queries = gql`
  type Query {
    clients: [Client!]
    client(id: ID!): Client

    projects: [Project!]
    project(id: ID!): Project
  }

  type Mutation {
    addClient(email: String!, name: String!, phone: String): Client
    deleteClient(id: ID!): Client

    addProject(
      name: String!
      description: String
      clientId: ID!
      status: ProjectStatus
    ): Project
    updateProject(
      id: ID!
      name: String
      description: String
      clientId: ID
      status: ProjectStatus
    ): Project
    deleteProject(id: ID!): Project
  }
`;

export default queries;
