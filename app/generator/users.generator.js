const { faker } = require("@faker-js/faker");

function findCountOfUsers(sqlite3) {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) AS count FROM users`;
    sqlite3.get(query, (error, count) => {
      if (error) {
        reject(error);
      } else {
        resolve(count);
      }
    });
  });
}

function executeQueryForInsertion(sqlite3) {
  const userName = faker.person.fullName();
  const userEmail = faker.internet.email();
  const query = `INSERT INTO users(user_name, user_email)
    VALUES(?, ?)`;

  sqlite3.run(query, [userName, userEmail], (error) => {
    if (error) {
      console.log("Error occured while inserting users", error.message);
    }
  });
}

function insertValuesInUsers(sqlite3) {
  findCountOfUsers(sqlite3)
    .then((userCount) => {
      if (userCount.count === 0) {
        for (let userId = 1; userId <= 1000; userId++) {
          executeQueryForInsertion(sqlite3);
        }
      }
    })
    .catch((error) => {
      console.log("error: ", error.message);
    });
}

module.exports = insertValuesInUsers;
