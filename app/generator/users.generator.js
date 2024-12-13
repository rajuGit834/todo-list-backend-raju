const { faker } = require("@faker-js/faker");

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
  for (let userId = 1; userId <= 1000; userId++) {
    executeQueryForInsertion(sqlite3);
  }
}

module.exports = insertValuesInUsers;
