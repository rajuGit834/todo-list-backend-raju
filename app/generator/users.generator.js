const { faker } = require("@faker-js/faker");

function getBulkData(dataCount) {
  const bulkData = [];

  for (let i = 1; i <= dataCount; i++) {
    const firstUserName = faker.person.firstName();
    const lastUserName = faker.person.lastName();
    const userName = firstUserName + " " + lastUserName;
    const email = `${firstUserName}${lastUserName}@gmail.com`;
    console.log(email);
    bulkData.push([userName, email]);
  }
  return bulkData;
}

function insertDataInUsers(sqlite3) {
  const totalData = 1000;
  const batchSize = 100;
  const toBeInsertedAtATime = totalData / batchSize;
  for (let i = 1; i <= toBeInsertedAtATime; i++) {
    const bulkData = getBulkData(batchSize);

    const placeHolder = bulkData.map(() => "(?, ?)").join(", ");

    const query = `INSERT INTO users(user_name, user_email) VALUES ${placeHolder}`;
    sqlite3.run(query, bulkData.flat(), (error) => {
      if (error) {
        console.log("Data not inserted in users table.", error.message);
      } else {
        console.log("Data inserted successfully in users table.");
      }
    });
  }
}

module.exports = insertDataInUsers;
