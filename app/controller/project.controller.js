const Project = require("../models/project.model.js");

exports.createProject = (req, res) => {
  const project = new Project(req.body);

  Project.create(project)
    .then((newProject) => {
      return res
        .status(201)
        .send({ message: "Project added successfully.", project: newProject });
    })
    .catch((error) => {
      if (error.message.includes("SQLITE_CONSTRAINT")) {
        return res.status(400).send({
          error: "Invalid foreign key",
          message:
            "The provided 'user_id' is invalid or does not exist. Please provide a valid 'user_id'.",
        });
      }
      return res.status(500).send({
        message: "Project creation failed.",
        error: error.message,
      });
    });
};

exports.getAllProjects = (req, res) => {
  Project.findAll()
    .then((rows) => {
      if (!rows.length) {
        return res.status(204).send({ message: "No projects found at this moment." });
      }
      return res.status(200).send(rows);
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Failed to fetch projects.",
        error: error.message,
      });
    });
};

exports.getOneUserById = (req, res) => {
  let id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number and greater than 0.",
    });
  }

  Project.findById(id)
    .then((project) => {
      if (!project) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "No Project Found" });
      }
      return res.send(project);
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while fetching projects",
        details: error.message,
      });
    });
};

exports.updateProject = (req, res) => {
  const id = Number(req.params.id);

  Project.updateById(id, req.body)
    .then((updatedProject) => {
      return res.status(200).send({
        message: "Project Updated Successfully.",
        project: updatedProject,
      });
    })
    .catch((error) => {
      if(error.kind === "not_found"){
        return res.status(404).send({
          error: "Not Found",
          message: "Please Provide Valid ID",
        });
      }
      return res.status(500).send({
        error: "Update Failed",
        message: "An error occurred while updating the project.",
        details: error.message,
      });
    });
};

exports.deleteProject = (req, res) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number.",
    });
  }

  Project.deleteById(id)
    .then((message) => {
      return res.send({ message: message + id });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: "Not Found",
          message: `No project found with ID ${id}, or it was already deleted.`,
        });
      }
      return res.status(500).send({
        error: "Delete Failed",
        message: "An error occurred while attempting to delete the project.",
        details: error.message,
      });
    });
};
