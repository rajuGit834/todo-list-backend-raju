const Task = require("../models/task.model");

exports.createTask = (req, res, next) => {
  const task = new Task(req.body);

  Task.create(task)
    .then((newTask) => {
      return res.status(201).send({
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
        logger.error(error.message);
        const err = new Error(
          "The provided 'project_id' is invalid or does not exist. Please provide a valid 'project_id'."
        );
        err.status = 400;
        next(err);
        return;
      }

      next(error);
    });
};

exports.getAllTask = (req, res, next) => {
  Task.findAll(req.query)
    .then((tasks) => {
      if (!tasks.length) {
        const err = new Error("No tasks found at this moment.");
        err.status = 404;
        next(err);
        return;
      }
      return res.status(200).send(tasks);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getOneTaskById = (req, res, next) => {
  let id = Number(req.params.id);

  Task.findById(id)
    .then((task) => {
      if (!task) {
        const err = new Error("Task Not Exists");
        err.status = 404;
        next(err);
        return;
      }
      return res.status(200).send(task);
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateTask = (req, res, next) => {
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
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};

exports.deleteTask = (req, res, next) => {
  const id = Number(req.params.id);

  Task.deleteById(id)
    .then((message) => {
      return res
        .status(200)
        .send({ message: `Task with ID ${id} deleted successfully.` });
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
