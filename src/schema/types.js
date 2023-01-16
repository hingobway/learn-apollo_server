import { gql } from 'graphql-tag';

const types = gql`
  type Client {
    id: ID!
    email: String!
    name: String!
    phone: String
  }

  type Project {
    id: ID!
    name: String!
    description: String
    client: Client!
    status: ProjectStatus!
  }

  enum ProjectStatus {
    NEW
    IN_PROGRESS
    COMPLETED
  }
`;

export default types;
