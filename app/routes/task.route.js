module.exports = (app) => {
  const taskController = require("../controller/task.controller");
  const taskValidation = require("../validation/task.validation");
  const router = require("express").Router();

  router
    .route("/")
    .get(taskController.getAllTask)
    .post(taskValidation, taskController.createTask);
  router
    .route("/:id")
    .get(taskController.getOneTaskById)
    .put(taskValidation, taskController.updateTask)
    .delete(taskController.deleteTask);

  app.use("/api/task", router);
};
