require("dotenv").config();
const express = require("express");
const logger = require("./app/config/logger.js");
const loggerMiddleware = require("./app/middlewares/loggerMiddleware.js");
const errorHandlerMiddleware = require("./app/middlewares/errorHandler.js");
const app = express();

// Adding Middleware for parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome To Todo List Home Page");
});

const usersRoute = require("./app/routes/users.route.js");
usersRoute(app);

const projectsRoute = require("./app/routes/projects.route.js");
projectsRoute(app);

const taskRoute = require("./app/routes/task.route.js");
taskRoute(app);

const commentsRoute = require("./app/routes/comments.route.js");
commentsRoute(app);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
