module.exports = (app) => {
  const taskController = require("../controller/task.controller");
  const taskValidation = require("../validation/task.validation");
  const router = require("express").Router();

  router
    .route("/task")
    .get(taskController.getAllTask)
    .post(taskValidation, taskController.createTask);
  router
    .route("/task/:id")
    .put(taskValidation, taskController.updateTask)
    .delete(taskController.deleteTask);

  app.use("/api", router);
};
