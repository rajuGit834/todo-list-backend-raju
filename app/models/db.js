const sqlite3 = require("sqlite3");
const db = require("../config/config.js");
const { constants } = require("buffer");

function createProjectList(connection) {
  const query = `CREATE TABLE IF NOT EXISTS projects(
      project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT NOT NULL,
      color TEXT NOT NULL,
      is_favorite BOOLEAN DEFAULT FASLE
      )`;

  connection.run(query, (error) => {
    if (error) {
      console.log("Project table is not created..", error.message);
    } else {
      console.log("Project table is created..");
    }
  });
}

function createTaskList(connection) {
  const query = `CREATE TABLE IF NOT EXISTS task (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    project_id INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
  )`;
  

  connection.run(query, (error) => {
    if (error) {
      console.log("Task table is not created..", error.message);
    } else {
      console.log("Task table is created..");
    }
  });
}

const connection = new sqlite3.Database(db.DB, (error) => {
  if (error) {
    console.log("Database not created..", error.message);
  } else {
    console.log("Database Created Successfully..");

    connection.run("PRAGMA foreign_keys = ON", (error) => {
      if (error) {
        console.log("Failed to enable foreign keys", error.message);
      } else {
        console.log("Foreign key support enabled.");
      }
    });

    createProjectList(connection);
    createTaskList(connection);
  }
});

module.exports = connection;
