const sqlite3 = require("./db.js");

const Task = function (newTask) {
  this.content = newTask.content;
  this.description = newTask.description;
  this.due_date = newTask.due_date;
  this.is_completed = newTask.is_completed;
  this.created_at = newTask.created_at;
  this.project_id = newTask.project_id;
};

Task.create = (task, result) => {
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
        return result(error, null);
      }
      return result(null, { id: this.lastID, ...task });
    }
  );
};

Task.findAll = (result) => {
  const query = `SELECT * FROM task`;

  sqlite3.all(query, [], (error, rows) => {
    if (error) {
      return result(error, null);
    }
    return result(null, rows);
  });
};

Task.updateById = (id, task, result) => {
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
        return result(error, null);
      }
      return result(null, { id: id, ...task });
    }
  );
};

Task.deleteById = (id, result) => {
  const query = `
      DELETE FROM task WHERE task_id = ?`;

  sqlite3.run(query, [id], function (error) {
    if (error) {
      return result(error);
    }
    if (this.changes === 0) {
      return result({ kind: "not_found" });
    }
    return result(null);
  });
};

module.exports = Task;
