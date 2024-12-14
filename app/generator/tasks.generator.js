const { faker } = require("@faker-js/faker");

function getBulkData(insertCount) {
  const bulkData = [];

  for (let i = 1; i <= insertCount; i++) {
    const content = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const dueDate = faker.date.future().toISOString().slice(0, 10);
    const isCompleted = faker.datatype.boolean();
    let projectId = Math.floor(Math.random() * 1_000_000);
    projectId = projectId === 0 ? 1 : projectId;

    bulkData.push([content, description, dueDate, isCompleted, projectId]);
  }
  return bulkData;
}

function insertDataInTasks(sqlite3) {
  return new Promise((resolve, reject) => {
    sqlite3.serialize(() => {
      const totalProjects = 1_000_000;
      const batchSize = 1000;
      const numBatches = totalProjects / batchSize;
      let totalDataInserted = 0;

      for (let i = 0; i < numBatches; i++) {
        const bulkData = getBulkData(batchSize);
        const placeHolder = bulkData.map(() => "(?, ?, ?, ?, ?)").join(", ");
        const query = `INSERT INTO task(content, description, due_date, is_completed, project_id) values ${placeHolder}`;

        sqlite3.run(query, bulkData.flat(), (error) => {
          if (error) {
            reject("Data not inserted in projects table " + error.message);
          } else {
            resolve(totalProjects);
          }
        });
      }
    });
  });
}

module.exports = insertDataInTasks;
