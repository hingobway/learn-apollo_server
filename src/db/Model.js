import db from './db.js';
import { randomUUID as uuid } from 'node:crypto';

const timestamp = () => Math.round(Date.now() / 1000);

class Model {
  schema = (self, old) => (data) => {
    const ts = timestamp();
    let out = data;

    if (!old)
      out = {
        type: self.type,
        id: uuid(),
        ...out,

        query: 0,
        tcreated: ts,
      };
    out.tupdated = ts;

    return Object.keys(out).reduce((obj, it) => {
      if (typeof out[it] !== 'undefined') return { ...obj, [it]: out[it] };
      return obj;
    }, {});
  };

  async create(item) {
    return await create({
      table: this.table,
      include: this.include,
      item: this.schema(this)(item),
    });
  }
  async get(id) {
    return await get({
      table: this.table,
      include: this.include,
      type: this.type,
      id,
    });
  }
  async batchGet(ids) {
    return await batchGet({
      table: this.table,
      type: this.type,
      ids,
    });
  }
  async all() {
    return await all({
      table: this.table,
      include: this.include,
      type: this.type,
    });
  }
  async update(id, changes) {
    return await update({
      table: this.table,
      type: this.type,
      id,
      add: this.schema(this, true)(changes),
    });
  }
  async delete(id) {
    return await del({
      table: this.table,
      type: this.type,
      id,
    });
  }
}
export default Model;

const create = async ({ table, include, item }) => {
  try {
    await db.put(table, item);
    return await get({ table, id: item.id, type: item.type, include });
  } catch (error) {
    return { error };
  }
};
const get = async ({ table, type, id, include }) => {
  try {
    return {
      data: await db.get(table, { type, id }, include),
    };
  } catch (error) {
    return { error };
  }
};
const batchGet = async ({ table, type, ids }) => {
  try {
    return {
      data: await db.batchGet(
        table,
        ids.map((id) => ({ id, type }))
      ),
    };
  } catch (error) {
    return { error };
  }
};
const all = async ({ table, include, type }) => {
  try {
    return {
      data: await db.query(table, { include, query: { type } }),
    };
  } catch (error) {
    return { error };
  }
};
const update = async ({ table, type, id, add, remove }) => {
  try {
    return {
      data: await db.update(table, {
        id: { type, id },
        add,
        remove,
      }),
    };
  } catch (error) {
    return { error };
  }
};
const del = async ({ table, type, id }) => {
  try {
    return { data: await db.delete(table, { id, type }) };
  } catch (error) {
    return { error };
  }
};
