import DataLoader from 'dataloader';

import Model from '../db/Model.js';

class ProjectSource extends Model {
  table = 'learn--apollo';
  type = 'project';

  // batch commands
  async handleBatch(ids) {
    const { data, error } = await this.batchGet(ids);
    if (error) throw error;

    return ids.map((id) => data.find((it) => it.id === id));
  }
  batchProjects = new DataLoader(this.handleBatch.bind(this));

  // methods
  async getProject(id) {
    return this.batchProjects.load(id);
  }
  async getTheseProjects(ids) {
    return this.batchProjects.loadMany(ids);
  }
  async getProjects() {
    const { data, error } = await this.all();
    if (error) throw error;
    return data;
  }
  async findProjectsByClient(clientId) {
    const { data, error } = await this.find({ clientId });
    if (error) throw error;
    return data;
  }

  async addProject(client) {
    const { data, error } = await this.create(client);
    if (error) throw error;
    return data;
  }
  async updateProject(id, args) {
    const { data, error } = await this.update(id, args);
    if (error) throw error;
    return data;
  }
  async deleteProject(id) {
    const { data, error } = await this.delete(id);
    if (error) throw error;
    return data;
  }
}

export default ProjectSource;
