const logger = require("../config/logger");

const errorHandlerMiddleware = (err, req, res, next) => {
  logger.error(err.message);
  res
    .status(err.status || 500)
    .send({ error: err.message || "Internal Server Error" });
};

module.exports = errorHandlerMiddleware;
