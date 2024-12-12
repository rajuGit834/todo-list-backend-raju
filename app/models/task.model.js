const sqlite3 = require("./db.js");
const insertValuesInTask = require("../generator/tasks.generator.js");

const Task = function (newTask) {
  this.content = newTask.content;
  this.description = newTask.description;
  this.due_date = newTask.due_date;
  this.is_completed = newTask.is_completed;
  this.created_at = newTask.created_at;
  this.project_id = newTask.project_id;
};

// insertValuesInTask(sqlite3);

Task.create = (task) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO task (content, description, due_date, is_completed, project_id)
    VALUES (?, ?, ?, ?, ?)`;

    sqlite3.run(
      query,
      [
        task.content,
        task.description,
        task.due_date,
        task.is_completed,
        task.project_id,
      ],
      function (error) {
        if (error) {
          reject(error);
        }
        resolve({ id: this.lastID, ...task });
      }
    );
  });
};

Task.findAll = (requestQuery) => {
  let query = `SELECT * FROM task WHERE 1=1 `;
  const { project_id, due_date, is_completed, created_at } = requestQuery;
  const params = [];
  if (project_id) {
    query += "AND project_id = ?";
    params.push(project_id);
  }
  if (due_date) {
    query += "AND due_date = ?";
    params.push(due_date);
  }
  if (is_completed) {
    query += "AND is_completed = ?";
    params.push(is_completed);
  }
  if (created_at) {
    query += "AND created_at = ?";
    params.push(created_at);
  }

  return new Promise((resolve, reject) => {
    sqlite3.all(query, params, (error, rows) => {
      if (error) {
        reject(error);
      }
      resolve(rows);
    });
  });
};

Task.findById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM task WHERE id = ?`;
    sqlite3.get(query, [id], (error, row) => {
      resolve(row);
    });
  });
};

Task.updateById = (id, task) => {
  return new Promise((resolve, reject) => {
    const query = `
    UPDATE task 
    SET content = ?, description = ?, due_date = ?, is_completed = ?, project_id = ?
    WHERE task_id = ?
    `;

    sqlite3.run(
      query,
      [
        task.content,
        task.description,
        task.due_date,
        task.is_completed,
        task.project_id,
        id,
      ],
      (error) => {
        if (error) {
          reject(error);
        }
        resolve({ id: id, ...task });
      }
    );
  });
};

Task.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM task WHERE task_id = ?`;

    sqlite3.run(query, [id], function (error) {
      if (error) {
        reject(error);
      }
      if (this.changes === 0) {
        reject({ kind: "not_found" });
        return;
      }
      resolve("Task Deleted Successfully.");
    });
  });
};

module.exports = Task;
