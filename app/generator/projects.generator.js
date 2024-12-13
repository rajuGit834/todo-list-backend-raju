const { faker } = require("@faker-js/faker");

function executeBulkInsert(sqlite3) {
  const insertCount = 1000;
  const statement = sqlite3.prepare(
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

      statement.run(projectName, color, isFavorite, userId);
    }
    statement.finalize();
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
