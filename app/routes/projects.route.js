module.exports = (app) => {
  const projectController = require("../controller/project.controller");
  const router = require("express").Router();

  router
    .route("/projects")
    .get(projectController.getAllProjects)
    .post(projectController.createProject);
  router
    .route("/projects/:id")
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);

  app.use("/api", router);

};
