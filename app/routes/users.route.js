module.exports = (app) => {
  const router = require("express").Router();
  const userValidation = require("../validation/users.validation");
  const usersController = require("../controller/users.controller");
  const validIdMiddleware = require("../middlewares/validIdMiddleware");

  router
    .route("/")
    .get(usersController.getAllUsers)
    .post(userValidation, usersController.createUser);
  router
    .route("/:id")
    .get(validIdMiddleware, usersController.getOneUserById)
    .put(userValidation, usersController.updateUser)
    .delete(validIdMiddleware, usersController.deleteUser);

  app.use("/api/users", router);
};
