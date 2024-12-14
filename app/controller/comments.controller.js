const { CONSTRAINT } = require("sqlite3");
const Comment = require("../models/comments.model");
const commentsRoute = require("../routes/comments.route");
const logger = require("../config/logger");

exports.createComment = (req, res, next) => {
  const comment = new Comment(req.body);

  Comment.create(comment)
    .then((newComment) => {
      return res.status(201).send({
        message: "Comment Added Successfully..",
        comment: newComment,
      });
    })
    .catch((error) => {
      if (error.message.includes("SQLITE_CONSTRAINT")) {
        logger.error(error.message);
        const err = new Error(
          "The provided project ID or task ID does not exist or is invalid. Please ensure you are using valid IDs."
        );
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};

exports.getAllComments = (req, res, next) => {
  Comment.findAll()
    .then((comments) => {
      if (!comments.length) {
        const err = new Error("No comments are available at the moment.");
        err.status = 404;
        next(err);
        return;
      }
      return res.status(200).send({
        message: "Comments retrieved successfully.",
        comments: comments,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getOneCommentById = (req, res, next) => {
  let id = Number(req.params.id);

  Comment.findById(id)
    .then((comment) => {
      if (!comment) {
        const err = new Error("Comment Not Exists");
        err.status = 404;
        next(err);
        return;
      }
      return res.send(comment);
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateComment = (req, res, next) => {
  const id = Number(req.params.id);

  Comment.updateById(id, req.body)
    .then((updatedComment) => {
      return res.status(200).send({
        message: "Comment Updated Successfully.",
        comment: updatedComment,
      });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};

exports.deleteComment = (req, res, next) => {
  const id = Number(req.params.id);

  Comment.deleteById(id)
    .then((message) => {
      return res.status(200).send({ message: message });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        const err = new Error("Please Provide a Valid ID.");
        err.status = 404;
        next(err);
        return;
      }
      next(error);
    });
};
