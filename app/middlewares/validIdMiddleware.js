const logger = require("../config/logger");

const validIdMiddleware = (req, res, next) => {
  let id = Number(req.params.id);

  if (id <= 0) {
    logger.error("Invalid ID");
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number and greater than 0.",
    });
  }

  next();
};

module.exports = validIdMiddleware;
