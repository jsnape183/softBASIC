import auth0 from "../../../lib/auth0";
import repos from "../../../db";
import { apiSuccess, apiFail } from "../../../api/responses";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const project = await repos.projects.create({
      name: "Untitled Project",
      files: [{ name: "main.bas", source: "" }],
      created_by: req.body.created_by
    });
    if (!project._id) {
      res.status(500, apiFail("Error creating project."));
      return;
    }
    res.status(200).json(apiSuccess(project));
    return;
  }

  const { user } = auth0.getSession(req, res);
  if (!user) {
    res.status(403).json(apiFail("You must be logged in to view projects."));
    return;
  }
  const projects = await repos.projects.getAll(user.sub);

  if (!projects) {
    res.status(404).json(apiFail({}));
    return;
  }

  res.status(200).json(apiSuccess(projects));
}
