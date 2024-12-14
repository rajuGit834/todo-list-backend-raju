const { faker } = require("@faker-js/faker");

function getBulkData(insertCount) {
  const bulkData = [];

  for (let i = 1; i <= insertCount; i++) {
    const content = faker.lorem.paragraph();
    let project_id = Math.floor(Math.random() * 1000);
    project_id = project_id === 0 ? 1 : project_id;
    let task_id = Math.floor(Math.random() * 1000);
    task_id = task_id === 0 ? null : task_id;

    bulkData.push([content, project_id, task_id]);
  }
  return bulkData;
}

function insertDataInComment(sqlite3) {
  sqlite3.serialize(() => {
    const totalComment = 10_000;
    const batchSize = 250;
    const numBatches = Math.ceil(totalComment / batchSize);

    for (let i = 1; i <= numBatches; i++) {
      const bulkData = getBulkData(batchSize);
      const placeHolder = bulkData.map(() => "(?, ?, ?)").join(", ");
      const query = `INSERT INTO comments(content, project_id, task_id) VALUES ${placeHolder}`;
      sqlite3.run(query, bulkData.flat(), (error) => {
        if (error) {
          console.log("Data is not inserted in Comments table.", error.message);
        } else {
          console.log(`${batchSize * i} data inserted in comments table`);
        }
      });
    }
  });
}

module.exports = insertDataInComment;
