const { faker } = require("@faker-js/faker");

// function findCountOfProjects(sqlite3) {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT COUNT(*) AS count FROM projects`;
//     sqlite3.get(query, (error, count) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(count);
//       }
//     });
//   });
// }

// function executeQueryForInsertion(sqlite3) {
//   const projectName = faker.commerce.productName();
//   const color = faker.color.human();
//   const isFavorite = faker.datatype.boolean();
//   const userId = Math.floor(Math.random() * 1000);

//   const query = `INSERT INTO projects(project_name, color, is_favorite, user_id)
//     VALUES(?, ?, ?, ?)`;

//   sqlite3.run(query, [projectName, color, isFavorite, userId], (error) => {
//     if (error) {
//       console.log("Error occured while inserting users", error.message);
//     }
//   });
// }

// function insertValuesInProjects(sqlite3) {
//   findCountOfProjects(sqlite3)
//     .then((projectCount) => {
//         console.log(projectCount.count);
//       if (projectCount.count === 0) {
//         for (let projectId = 1; projectId <= 1_000_000; projectId++) {
//           executeQueryForInsertion(sqlite3);
//         }
//       }
//     })
//     .catch((error) => {
//       console.log("error:", error.message);
//     });
// }

// module.exports = insertValuesInProjects;

function executeBulkInsert(sqlite3) {
  const insertCount = 1000;
  const stmt = sqlite3.prepare(
    `INSERT INTO projects(project_name, color, is_favorite, user_id)
     VALUES(?, ?, ?, ?)`
  );

  sqlite3.serialize(() => {
    sqlite3.run("BEGIN TRANSACTION");
    for (let i = 0; i < insertCount; i++) {
      const projectName = faker.commerce.productName();
      const color = faker.color.human();
      const isFavorite = faker.datatype.boolean();
      let userId = Math.floor(Math.random() * 1000);
      userId = userId === 0 ? 1 : userId;

      stmt.run(projectName, color, isFavorite, userId);
    }
    stmt.finalize();
    sqlite3.run("COMMIT");
  });
}

function insertValuesInProjects(sqlite3) {
  const totalProjects = 1_000_000;
  const batchSize = 1000;
  const numBatches = Math.ceil(totalProjects / batchSize);

  for (let i = 0; i < numBatches; i++) {
    executeBulkInsert(sqlite3);
  }
}

module.exports = insertValuesInProjects;