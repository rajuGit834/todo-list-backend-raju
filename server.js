const exp = require("constants");
const express = require("express");
const PORT = 8080;
const app = express();

// Adding Middleware for parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome To Todo List Home Page");
});

require("./app/routes/todo.route.js")(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
