const sqlite3 = require("./db.js");
const insertValuesInComment = require("../generator/comments.generator.js");

const Comment = function (newComment) {
  (this.content = newComment.content),
    (this.projectId = newComment.project_id),
    (this.taskId = newComment.task_id || null);
};

// insertValuesInComment(sqlite3);

Comment.create = (comment) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO comments(content, project_id, task_id) VALUES(?, ?, ?)`;

    sqlite3.run(
      query,
      [comment.content, comment.projectId, comment.taskId],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve({ id: this.lastID, ...comment });
        }
      }
    );
  });
};

Comment.findAll = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM comments`;

    sqlite3.all(query, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

// Comment.findByProjectId = (taskId, projectId) => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * from task WHERE task_id = ? AND project_id = ?`;
//     sqlite3.get(query, [taskId, projectId], (error, task) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(task);
//       }
//     });
//   });
// };

Comment.findById = (id) => {
  const query = `SELECT * FROM comments where comment_id = ?`;

  return new Promise((resolve, reject) => {
    sqlite3.get(query, [id], (error, comment) => {
      if (error) {
        reject(error);
      }
      resolve(comment);
    });
  });
};

Comment.updateById = (id, comment) => {
  return new Promise((resolve, reject) => {
    const query = `
          UPDATE comments 
          SET content = ?, project_id = ?, task_id = ?
          WHERE comment_id = ?
          `;

    sqlite3.run(
      query,
      [comment.content, comment.project_id, comment.task_id, id],
      function (error) {
        if (error) {
          reject(error);
        }
        if (this.changes === 0) {
          reject({ kind: "not_found" });
        }
        resolve({ id: id, ...comment });
      }
    );
  });
};

Comment.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
            DELETE FROM comments WHERE comment_id = ?`;

    sqlite3.run(query, [id], function (error) {
      if (error) {
        reject(error);
      }
      if (this.changes === 0) {
        reject({ kind: "not_found" });
        return;
      }
      resolve(`Comment with ID ${id} Deleted Successfully`);
    });
  });
};

module.exports = Comment;
