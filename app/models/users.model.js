const sqlite3 = require("./db");

const User = function (newUser) {
  this.userName = newUser.user_name;
  this.userEmail = newUser.user_email.toLowerCase();
};

User.create = (user) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users(user_name, user_email)
        VALUES(?, ?)`;
    sqlite3.run(query, [user.userName, user.userEmail], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve({ id: this.lastID, ...user });
      }
    });
  });
};

User.findAll = () => {
  const query = `SELECT * FROM users`;

  return new Promise((resolve, reject) => {
    sqlite3.all(query, [], (error, rows) => {
      if (error) {
        reject(error);
      }
      resolve(rows);
    });
  });
};

User.updateById = (id, user) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users 
      SET user_name = ?, user_email = ?
      WHERE user_id = ?
      `;

    sqlite3.run(query, [user.user_name, user.user_email, id], (error) => {
      if (error) {
        reject(error);
      }
      resolve({ id: id, ...user });
    });
  });
};

User.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
        DELETE FROM users WHERE user_id = ?`;

    sqlite3.run(query, [id], function (error) {
      if (error) {
        reject(error);
      }
      if (this.changes === 0) {
        reject({ kind: "not_found" });
        return;
      }
      resolve(`User with ID ${id} has been successfully deleted.`);
    });
  });
};

module.exports = User;
