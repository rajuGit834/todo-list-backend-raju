const User = require("../models/users.model");
const logger = require("../config/logger");

exports.createUser = (req, res, next) => {
  const user = new User(req.body);

  User.create(user)
    .then((newUser) => {
      return res.status(201).send({
        message: "User Added Successfully..",
        user: newUser,
      });
    })
    .catch((error) => {
      if (error.message.includes("SQLITE_CONSTRAINT: UNIQUE constraint")) {
        logger.error(error.message);
        const err = new Error("The provided email is already in use.");
        err.status = 400;
        next(err);
        return;
      }
      next(error);
    });
};

exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      if (!users.length) {
        const err = new Error("No Users Found");
        err.status = 404;
        next(err);
        return;
      }
      return res.send(users);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getOneUserById = (req, res, next) => {
  let id = Number(req.params.id);

  User.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Exists");
        error.status = 404;
        next(error);
        return;
      }
      return res.send(user);
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateUser = (req, res) => {
  const id = Number(req.params.id);

  User.updateById(id, req.body)
    .then((updatedUser) => {
      return res.status(200).send({
        message: "User Updated Successfully.",
        user: updatedUser,
      });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      if (error.message.includes("SQLITE_CONSTRAINT: UNIQUE")) {
        const err = new Error("The provided email is already in use.");
        err.status = 400;
        next(err);
        return;
      }
      next(error);
    });
};

exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);

  User.deleteById(id)
    .then((message) => {
      return res.status(200).send({
        message: message,
      });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};
