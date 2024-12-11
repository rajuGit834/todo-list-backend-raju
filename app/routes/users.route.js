module.exports = (app) => {
  const router = require("express").Router();
  const usersController = require("../controller/users.controller");

  router
    .route("/users")
    .get(usersController.getAllUsers)
    .post(usersController.createUser);
  router
    .route("/users/:id")
    .put(usersController.updateUser)
    .delete(usersController.deleteUser);

  app.use("/api", router);
};
