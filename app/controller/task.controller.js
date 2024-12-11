const Task = require("../models/task.model");

exports.createTask = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing.",
      message:
        "The request body is required. Please provide the necessary data in the body of the request.",
    });
  }

  if (!req.body.project_id) {
    return res.status(422).send({
      error: "Missing required field.",
      message:
        "'project_id' is a required field. Please include it in the request body.",
    });
  }

  const task = new Task(req.body);

  Task.create(task)
    .then((newTask) => {
      return res.send({
        message: "Task Added Successfully..",
        task: newTask,
      });
    })
    .catch((error) => {
      if (
        error.message.includes(
          "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"
        )
      ) {
        return res.status(400).send({
          error: "Invalid foreign key",
          message:
            "The provided 'project_id' is invalid or does not exist. Please provide a valid 'project_id'.",
        });
      }

      return res.status(500).send({
        error: "Task creation failed",
        message: "An unexpected error occurred while adding the task.",
        details: error.message,
      });
    });
};

exports.getAllTask = (req, res) => {
  Task.findAll(req.query)
    .then((rows) => {
      if (!rows.length) {
        return res
          .status(200)
          .send({ message: "No tasks found at this moment." });
      }
      return res.send(rows);
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Something went wrong while fetching task",
        details: error.message,
      });
    });
};

exports.updateTask = (req, res) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({ message: "Id Must be a positive number." });
  }

  Task.findById(id)
    .then((task) => {
      if (!task) {
        return res
          .status(404)
          .send({ message: "Task not found with the given id." });
      }
      return updateById(id, req.body);
    })
    .then((updatedTask) => {
      return res.send({
        message: "Task Updated Successfully.",
        task: updatedTask,
      });
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ message: "Failed to update task", error: error.message });
    });
};

exports.deleteTask = (req, res) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({ message: "ID must be a positive number." });
  }

  Task.deleteById(id)
    .then((message) => {
      return res
        .status(200)
        .send({ message: `Task with ID ${id} deleted successfully.` });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: `Task with ID ${id} not found or already deleted.`,
        });
      }
      return res
        .status(500)
        .send({ message: "Failed to delete task.", error: error.message });
    });
};
