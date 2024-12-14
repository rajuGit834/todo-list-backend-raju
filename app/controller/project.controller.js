const logger = require("../config/logger.js");
const Project = require("../models/project.model.js");

exports.createProject = (req, res, next) => {
  const project = new Project(req.body);

  Project.create(project)
    .then((newProject) => {
      return res
        .status(201)
        .send({ message: "Project added successfully.", project: newProject });
    })
    .catch((error) => {
      if (error.message.includes("SQLITE_CONSTRAINT")) {
        logger.error(error.message);
        const err = new Error(
          "The provided 'user_id' is invalid or does not exist. Please provide a valid 'user_id'."
        );
        err.status = 400;
        next(err);
        return;
      }
      next(error);
    });
};

exports.getAllProjects = (req, res, next) => {
  Project.findAll()
    .then((rows) => {
      if (!rows.length) {
        const err = new Error("No projects found at this moment.");
        err.status = 204;
        next(err);
        return;
      }
      return res.status(200).send(rows);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getOneUser = (req, res, next) => {
  let id = Number(req.params.id);

  Project.findById(id)
    .then((project) => {
      if (!project) {
        const err = new Error("Project Not Exists");
        err.status = 404;
        next(err);
        return;
      }
      return res.send(project);
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateProject = (req, res, next) => {
  const id = Number(req.params.id);

  Project.findById(id)
    .then((project) => {
      const requestBody = {
        projectName: req.body.project_name || project.project_name,
        color: req.body.color || project.color,
        isFavorite: req.body.is_favorite || project.is_favorite,
      };
      return Project.updateById(id, requestBody);
    })
    .then((updatedProject) => {
      return res.status(200).send({
        message: "Project Updated Successfully.",
        project: updatedProject,
      });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};

exports.deleteProject = (req, res, next) => {
  const id = Number(req.params.id);

  Project.deleteById(id)
    .then((message) => {
      return res.status(200).send({ message: message + id });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};
