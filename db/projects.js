import { getClient, ObjectID } from "./lib";

export default {
  getById: async (id) => {
    const client = await getClient();
    const project = await client
      .db()
      .collection("projects")
      .findOne({ _id: ObjectID(id) });
    return project;
  },
  getAll: async (user) => {
    const client = await getClient();
    const projects = await client
      .db()
      .collection("projects")
      .find({ created_by: user })
      .toArray();

    return projects;
  },
  create: async (project) => {
    const client = await getClient();
    await client.db().collection("projects").insertOne(project);

    return project;
  },
  update: async (id, name, files) => {
    const client = await getClient();
    const res = await client
      .db()
      .collection("projects")
      .updateOne(
        { _id: ObjectID(id) },
        {
          $set: { files: files, name: name }
        }
      );

    return (
      res.acknowledged && res.matchedCount === 1 && res.modifiedCount === 1
    );
  },
  remove: async (id, slideId) => {
    const client = await getClient();
    const res = await client
      .db()
      .collection("projects")
      .updateOne({ _id: ObjectID(id) }, { $pull: { slides: { id: slideId } } });

    return (
      res.acknowledged && res.matchedCount === 1 && res.modifiedCount === 1
    );
  }
};
