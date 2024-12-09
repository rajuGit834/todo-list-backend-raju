const sqlite3 = require("./db.js");

const Project = function (newProject) {
  this.project_name = newProject.project_name;
  this.color = newProject.color;
  this.is_favorite = newProject.is_favorite;
};

Project.create = (project, result) => {
  const query = `INSERT INTO projects(project_name, color, is_favorite)
    VALUES(?, ?, ?)`;

  sqlite3.run(
    query,
    [project.project_name, project.color, project.is_favorite],
    function (error) {
      if (error) {
        return result(error, null);
      }
      return result(null, { id: this.lastID, ...project });
    }
  );
};

Project.findAll = (result) => {
  const query = `SELECT * FROM projects`;

  sqlite3.all(query, (error, rows) => {
    if (error) {
      return result(error, null);
    }
    return result(null, rows);
  });
};

Project.updateById = (id, project, result) => {
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
        return result(error, null);
      }
      return result(null, { id: id, ...project });
    }
  );
};

Project.deleteById = (id, result) => {
  const query = `
        DELETE FROM projects WHERE project_id = ?`;

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

module.exports = Project;
