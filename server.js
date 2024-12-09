const exp = require("constants");
const express = require("express");
const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./app/routes/todo.route.js")(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
