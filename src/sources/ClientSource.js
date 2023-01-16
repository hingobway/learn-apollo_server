import DataLoader from 'dataloader';

import Model from '../db/Model.js';

class ClientSource extends Model {
  table = 'learn--apollo';
  type = 'client';

  // batch commands
  async handleBatch(ids) {
    const { data, error } = await this.batchGet(ids);
    if (error) throw error;

    return ids.map((id) => data.find((it) => it.id === id));
  }
  batchClients = new DataLoader(this.handleBatch.bind(this));

  // methods
  async getClient(id) {
    return this.batchClients.load(id);
  }
  async getTheseClients(ids) {
    return this.batchClients.loadMany(ids);
  }
  async getClients() {
    const { data, error } = await this.all();
    if (error) throw error;
    return data;
  }

  async addClient(client) {
    const { data, error } = await this.create(client);
    if (error) throw error;
    return data;
  }
  async deleteClient(id) {
    const { data, error } = await this.delete(id);
    if (error) throw error;
    return data;
  }
}

export default ClientSource;
