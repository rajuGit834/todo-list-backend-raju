module.exports = (app) => {
  const router = require("express").Router();
  const userValidation = require("../validation/users.validation");
  const usersController = require("../controller/users.controller");

  router
    .route("/")
    .get(usersController.getAllUsers)
    .post(userValidation, usersController.createUser);
  router
    .route("/:id")
    .get(usersController.getOneUserById)
    .put(userValidation, usersController.updateUser)
    .delete(usersController.deleteUser);

  app.use("/api/users", router);
};
