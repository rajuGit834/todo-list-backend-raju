const { faker } = require("@faker-js/faker");

function getBulkData(insertCount) {
  const bulkData = [];

  for (let i = 1; i <= insertCount; i++) {
    const projectName = faker.commerce.productName();
    const color = faker.color.human();
    const isFavorite = faker.datatype.boolean();
    let userId = Math.floor(Math.random() * 1000);
    userId = userId === 0 ? 1 : userId;

    bulkData.push([projectName, color, isFavorite, userId]);
  }
  return bulkData;
}

function insertDataInProjects(sqlite3) {
  sqlite3.serialize(() => {
    const totalProjects = 1_000_000;
    const batchSize = 1000;
    const numBatches = totalProjects / batchSize;
    let totalDataInserted = 0;

    for (let i = 0; i < numBatches; i++) {
      const bulkData = getBulkData(batchSize);
      const placeHolder = bulkData.map(() => "(?, ?, ?, ?)").join(", ");
      const query = `INSERT INTO projects(project_name, color, is_favorite, user_id) VALUES ${placeHolder}`;
      totalDataInserted += bulkData.length;
      sqlite3.run(query, bulkData.flat(), (error) => {
        if (error) {
          console.log("Data not inserted in projects table.", error.message);
        } else {
          console.log("Data inserted successfully in projects table.");
        }
      });
    }
  });
}

module.exports = insertDataInProjects;
