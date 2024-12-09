const Task = require("../models/task.model");

exports.createTask = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: "Body can not be empty!" });
  }
  if (!req.body.project_id) {
    return res
      .status(400)
      .send({ error: "project_id field can not be empty!" });
  }
  const task = new Task(req.body);

  Task.create(task, (error, newTask) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Task not added", error: error.message });
    }
    return res.send({
      message: "Task Added Successfully..",
      ...newTask,
    });
  });
};

exports.getAllTask = (req, res) => {
  Task.findAll((error, rows) => {
    if (error) {
      return res.status(500).send({
        error: "Something went wrong while finding task",
        error: error.message,
      });
    }
    if (!rows.length) {
      return res.status(404).send({ message: "No any Task is available" });
    }
    return res.send(rows);
  });
};

exports.updateTask = (req, res) => {
  const id = Number(req.params.id);

  if (id < 0) {
    return res.status(400).send({ message: "Id Must be positive." });
  }

  Task.updateById(id, req.body, (error, updatedTask) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Task not updated", error: error.message });
    }
    return res.send({ message: "Task Updated Successfully.", ...updatedTask });
  });
};

exports.deleteTask = (req, res) => {
  const id = Number(req.params.id);

  if (id < 0) {
    return res.status(400).send({ message: "Id Must be positive." });
  }

  Task.deleteById(id, (error) => {
    if (error) {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: "Id is not available or already deleted with id " + id,
        });
      }
      return res
        .status(500)
        .send({ message: "Task not updated", error: error.message });
    }
    return res.send({ message: "Task Deleted Successfully with id " + id });
  });
};
