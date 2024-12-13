const sqlite3 = require("./db.js");
const insertDataInTask = require("../generator/tasks.generator.js");

const Task = function (newTask) {
  this.content = newTask.content;
  this.description = newTask.description;
  this.due_date = newTask.due_date;
  this.is_completed = newTask.is_completed;
  this.project_id = newTask.project_id;
};

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
    sqlite3.all(query, params, (error, tasks) => {
      if (error) {
        reject(error);
      }
      resolve(tasks);
    });
  });
};

Task.findById = (id) => {
  const query = `SELECT * FROM task where task_id = ?`;

  return new Promise((resolve, reject) => {
    sqlite3.get(query, [id], (error, task) => {
      if (error) {
        reject(error);
      }
      resolve(task);
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
      function (error) {
        if (error) {
          reject(error);
        }
        if (this.changes === 0) {
          reject({ kind: "not_found" });
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

// async function solve() {
//   for (let i = 1; i <= 10; i++) {
//     const startTime = performance.now(); // Record the start time
//     try {
//       const result = await insertDataInTask(sqlite3);
//       const endTime = performance.now(); // Record the end time
//       const processingTime = (endTime - startTime).toFixed(2); // Calculate processing time in milliseconds
//       console.log(`Task ${i} resolved with:`, result * i);
//       console.log(`Task ${i} processing time: ${processingTime} ms`);
//     } catch (error) {
//       const endTime = performance.now();
//       const processingTime = (endTime - startTime).toFixed(2);
//       console.error(`Task ${i} failed with error:`, error);
//       console.log(`Task ${i} processing time: ${processingTime} ms`);
//     }
//   }
// }

// solve();

module.exports = Task;
