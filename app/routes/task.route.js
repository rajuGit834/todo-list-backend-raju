module.exports = (app) => {
  const taskController = require("../controller/task.controller");
  const router = require("express").Router();

  router
    .route("/task")
    .get(taskController.getAllTask)
    .post(taskController.createTask);
  router
    .route("/task/:id")
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

  app.use("/api", router);

};
