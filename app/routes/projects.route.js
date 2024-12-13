module.exports = (app) => {
  const projectController = require("../controller/project.controller");
  const projectValidation = require("../validation/projects.validation");
  const router = require("express").Router();

  router
    .route("/projects")
    .get(projectController.getAllProjects)
    .post(projectValidation, projectController.createProject);
  router
    .route("/projects/:id")
    .get(projectController.getOneUserById)
    .put(projectValidation, projectController.updateProject)
    .delete(projectController.deleteProject);

  app.use("/api", router);
};
