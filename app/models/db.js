const sqlite3 = require("sqlite3");
const db = require("../config/config.js");
const { constants } = require("buffer");

function createUserTable(connection) {
  const query = `CREATE TABLE IF NOT EXISTS users(
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE
  )`;

  connection.run(query, (error) => {
    if (error) {
      console.log("Users table is not created..", error.message);
    } else {
      console.log("Users table is created...");
    }
  });
}

function createProjectTable(connection) {
  const query = `CREATE TABLE IF NOT EXISTS projects(
      project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT NOT NULL,
      color TEXT NOT NULL,
      is_favorite BOOLEAN DEFAULT FASLE,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )`;

  connection.run(query, (error) => {
    if (error) {
      console.log("Project table is not created..", error.message);
    } else {
      console.log("Project table is created..");
    }
  });
}

function createTaskTable(connection) {
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

function createCommentsTable(connection) {
  const query = `CREATE TABLE IF NOT EXISTS comments(
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    project_id INTEGER NOT NULL,
    task_id INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE
    )`;

  connection.run(query, (error) => {
    if (error) {
      console.log("Comments table is not created..", error.message);
    } else {
      console.log("Comments table is created successfully..");
    }
  });
}

const connection = new sqlite3.Database(db.DB, (error) => {
  if (error) {
    console.log("Not Connected With Database..", error.message);
  } else {
    console.log("Connected With Database Successfully..");

    connection.run("PRAGMA foreign_keys = ON", (error) => {
      if (error) {
        console.log("Failed to enable foreign keys", error.message);
      } else {
        console.log("Foreign key support enabled.");
      }
    });
    createUserTable(connection);
    createProjectTable(connection);
    createTaskTable(connection);
    createCommentsTable(connection);
  }
});

module.exports = connection;
