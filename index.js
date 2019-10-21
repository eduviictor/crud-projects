const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

function checkExistsProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project alreay exists" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkExistsProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(project);
});

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkExistsProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  projects[index].tasks.push(title);

  return res.json(projects);
});

server.delete("/projects/:id", checkExistsProject, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id !== id);

  projects.splice(index, 1);

  return res.send("Deletado");
});

server.listen(3000, () => console.log("Servidor rodando!"));
