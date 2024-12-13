const Task = require("../models/task.model");

exports.createTask = (req, res) => {
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
    .then((tasks) => {
      if (!tasks.length) {
        return res
          .status(200)
          .send({ message: "No tasks found at this moment." });
      }
      return res.status(200).send(tasks);
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Something went wrong while fetching task",
        details: error.message,
      });
    });
};

exports.getOneTaskById = (req, res) => {
  let id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number and greater than 0.",
    });
  }

  Task.findById(id)
    .then((task) => {
      if (!task) {
        return res
          .status(404)
          .send({ error: "Not Found", message: "No Task Found" });
      }
      return res.status(200).send(task);
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while fetching tasks",
        details: error.message,
      });
    });
};

exports.updateTask = (req, res) => {
  const id = Number(req.params.id);

  Task.updateById(id, req.body)
    .then((updatedTask) => {
      return res.status(200).send({
        message: "Task Updated Successfully.",
        task: updatedTask,
      });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: "Not Found",
          message: "Please Provide Valid ID",
        });
      }
      return res.status(500).send({
        error: "Update Failed",
        message: "An error occurred while updating the task.",
        details: error.message,
      });
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
