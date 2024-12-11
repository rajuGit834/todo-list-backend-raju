const sqlite3 = require("./db.js");

const Project = function (newProject) {
  this.projectName = newProject.project_name;
  this.color = newProject.color;
  this.isFavorite = newProject.is_favorite;
  this.userId = newProject.user_id;
};

Project.create = (project) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO projects(project_name, color, is_favorite, user_id)
    VALUES(?, ?, ?, ?)`;
    sqlite3.run(
      query,
      [project.projectName, project.color, project.isFavorite, project.userId],
      function (error) {
        if (error) {
          reject(error);
        }
        resolve({ id: this.lastID, ...project });
      }
    );
  });
};

Project.findAll = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM projects`;

    sqlite3.all(query, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

Project.updateById = (id, project) => {
  return new Promise((resolve, reject) => {
    const query = `
        UPDATE projects 
        SET project_name = ?, color = ?, is_favorite = ?
        WHERE project_id = ?
        `;

    sqlite3.run(
      query,
      [project.project_name, project.color, project.is_favorite, id],
      (error) => {
        if (error) {
          reject(error);
        }
        resolve({ id: id, ...project });
      }
    );
  });
};

Project.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
          DELETE FROM projects WHERE project_id = ?`;

    sqlite3.run(query, [id], function (error) {
      if (error) {
        reject(error);
      }
      if (this.changes === 0) {
        reject({ kind: "not_found" });
        return;
      }
      resolve("Project Deleted Successfully with id ");
    });
  });
};

module.exports = Project;
