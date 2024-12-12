const { faker } = require("@faker-js/faker");

function executeBulkInsert(sqlite3) {
  const insertCount = 1000;
  const stmt = sqlite3.prepare(
    `INSERT INTO comments(content, project_id, task_id)
     VALUES(?, ?, ?)`
  );

  sqlite3.serialize(() => {
    sqlite3.run("BEGIN TRANSACTION");
    for (let i = 0; i < insertCount; i++) {
      const content = faker.lorem.paragraph();
      let projectId = Math.floor(Math.random() * 1_000_000);
      projectId = projectId === 0 ? 1 : projectId;
      let taskId = Math.floor(Math.random() * 5_00_000);
      taskId = taskId === 0 ? 1 : taskId;

      stmt.run(content, projectId, taskId);
    }
    stmt.finalize();
    sqlite3.run("COMMIT");
  });
}

function insertValuesInComment(sqlite3) {
  const totalComment = 10_000;
  const batchSize = 1000;
  const numBatches = Math.ceil(totalComment / batchSize);

  for (let i = 0; i < numBatches; i++) {
    executeBulkInsert(sqlite3);
  }
}

module.exports = insertValuesInComment;
