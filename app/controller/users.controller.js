const User = require("../models/users.model");

exports.createUser = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      error: "Request Body Missing.",
      message:
        "The request body is required. Please provide the necessary data in the body of the request.",
    });
  }
  const user = new User(req.body);

  User.create(user)
    .then((newUser) => {
      return res.send({
        message: "User Added Successfully..",
        user: newUser,
      });
    })
    .catch((error) => {
      if (
        error.message ===
        "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.user_email"
      ) {
        return res.status(400).send({
          error: "Conflict",
          message: "The provided email is already in use.",
        });
      }
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while adding the user.",
        details: error.message,
      });
    });
};

exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((rows) => {
      if (!rows.length) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "No Users Found" });
      }
      return res.send(rows);
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while fetching users",
        details: error.message,
      });
    });
};

exports.updateUser = (req, res) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number.",
    });
  }

  User.updateById(id, req.body)
    .then((updatedUser) => {
      return res.status(200).send({
        message: "User Updated Successfully.",
        user: updatedUser,
      });
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ message: "User not updated", error: error.message });
    });
};

exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number.",
    });
  }

  User.deleteById(id)
    .then((message) => {
      return res.status(200).send({
        message: message,
      });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: "Not Found",
          message: `No user found with ID ${id} or the user has already been deleted.`,
        });
      }
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while updating the user.",
        details: error.message,
      });
    });
};
