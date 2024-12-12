require("dotenv").config();

// fetching the database name from .env file
const dbName = process.env.DB;

module.exports = {
    DB : dbName
};