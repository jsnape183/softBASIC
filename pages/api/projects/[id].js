import repos from "../../../db";
import { apiSuccess, apiFail } from "../../../api/responses";

export default async function handler(req, res) {
  const { id } = req.query;
  const project = await repos.projects.getById(id);
  //console.log(project);
  if (!project) {
    res.status(404).json(apiFail(`Project ${id} does not exist`));
    return;
  }

  if (req.method === "POST") {
    const { name, files } = req.body;
    const result = await repos.projects.update(id, name, files);
    if (!result) {
      res.status(500).json(apiFail(`Failed to update project ${id}`));
      return;
    }
    res.status(200).json(apiSuccess({}));
    return;
  }
  res.status(200).json(apiSuccess(project));
}
