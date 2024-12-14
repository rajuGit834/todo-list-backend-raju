module.exports = (app) => {
  const projectController = require("../controller/project.controller");
  const projectValidation = require("../validation/projects.validation");
  const validIdMiddleware = require("../middlewares/validIdMiddleware");

  const router = require("express").Router();

  router
    .route("/projects")
    .get(projectController.getAllProjects)
    .post(projectValidation, projectController.createProject);
  router
    .route("/projects/:id")
    .get(validIdMiddleware, projectController.getOneUser)
    .put(projectValidation, projectController.updateProject)
    .delete(validIdMiddleware, projectController.deleteProject);

  app.use("/api", router);
};
