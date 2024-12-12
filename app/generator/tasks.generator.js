const { faker } = require("@faker-js/faker");

function executeBulkInsert(sqlite3) {
  const insertCount = 1000;
  const stmt = sqlite3.prepare(
    `INSERT INTO task(content, description, due_date, is_completed, project_id)
     VALUES(?, ?, ?, ?, ?)`
  );

  sqlite3.serialize(() => {
    sqlite3.run("BEGIN TRANSACTION");
    for (let i = 0; i < insertCount; i++) {
      const content = faker.lorem.sentence();
      const description = faker.lorem.paragraph();
      const dueDate = faker.date.future().toISOString().slice(0, 10);
      const isCompleted = faker.datatype.boolean();
      let projectId = Math.floor(Math.random() * 1_000_000);
      projectId = projectId === 0 ? 1 : projectId;

      stmt.run(content, description, dueDate, isCompleted, projectId);
    }
    stmt.finalize();
    sqlite3.run("COMMIT");
  });
}

function insertValuesInTask(sqlite3) {
  const totalTask = 10_000_000;
  const batchSize = 10_000;
  const numBatches = Math.ceil(totalTask / batchSize);

  for (let i = 0; i < numBatches; i++) {
    executeBulkInsert(sqlite3);
  }
}

module.exports = insertValuesInTask;
