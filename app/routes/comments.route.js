module.exports = (app) => {
  const router = require("express").Router();
  const commentsController = require("../controller/comments.controller");

  router
    .route("/comments")
    .get(commentsController.getAllComments)
    .post(commentsController.createComment);
  router
    .route("/comments/:id")
    .put(commentsController.updateComment)
    .delete(commentsController.deleteComment);

  app.use("/api", router);

  app.use((req, res) => {
    res.status(404).send({
      message: "URL Not Found",
      method: req.method,
      url: req.url,
    });
  });
};
