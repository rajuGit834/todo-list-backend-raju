module.exports = (app) => {
  const taskController = require("../controller/task.controller");
  const projectController = require("../controller/project.controller");
  const router = require("express").Router();

  router
    .route("/task")
    .get(taskController.getAllTask)
    .post(taskController.createTask);
  router
    .route("/task/:id")
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);
  router
    .route("/projects")
    .get(projectController.getAllProjects)
    .post(projectController.createProject);
  router
    .route("/projects/:id")
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);

  app.use("/api/", router);

  app.use((req, res) => {
    res.status(404).send({
      message: "URL Not Found",
      method: req.method,
      url: req.url,
    });
  });
};
