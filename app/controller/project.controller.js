const Project = require("../models/project.model.js");

exports.createProject = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: "Body can not be empty!" });
  }

  const project = new Project(req.body);

  Project.create(project, (error, newProject) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Project not added", error: error.message });
    }
    return res.send({ message: "Project added successfully.", ...newProject });
  });
};

exports.getAllProjects = (req, res) => {
  Project.findAll((error, rows) => {
    if (error) {
      return res
        .status(500)
        .send({
          error: "Something went wrong while finding projects",
          error: error.message,
        });
    }
    if (!rows.length) {
      return res.status(404).send({ message: "No any Projects is available" });
    }
    return res.send(rows);
  });
};

exports.updateProject = (req, res) => {
  const id = Number(req.params.id);

  if (id < 0) {
    return res.status(400).send({ message: "Id Must be positive." });
  }

  Project.updateById(id, req.body, (error, updatedTask) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Project not updated", error: error.message });
    }
    return res.send({
      message: "Project Updated Successfully.",
      ...updatedTask,
    });
  });
};

exports.deleteProject = (req, res) => {
  const id = Number(req.params.id);

  if (id < 0) {
    return res.status(400).send({ message: "Id Must be positive." });
  }

  Project.deleteById(id, (error) => {
    if (error) {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: "Id is not available or already deleted with id " + id,
        });
      }
      return res
        .status(500)
        .send({ message: "Project not updated", error: error.message });
    }
    return res.send({ message: "Project Deleted Successfully with id " + id });
  });
};
