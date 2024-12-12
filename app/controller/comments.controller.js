const { CONSTRAINT } = require("sqlite3");
const Comment = require("../models/comments.model");

exports.createComment = (req, res) => {
  const comment = new Comment(req.body);

  Comment.create(comment)
    .then((newComment) => {
      return res.status(200).send({
        message: "Comment Added Successfully..",
        comment: newComment,
      });
    })
    .catch((error) => {
      if (error.message.includes("SQLITE_CONSTRAINT")) {
        return res.status(404).send({
          error: "Invalid Foreign Key",
          message:
            "The provided project ID or task ID does not exist or is invalid. Please ensure you are using valid IDs.",
        });
      }
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while adding the comment.",
        details: error.message,
      });
    });
};

exports.getAllComments = (req, res) => {
  Comment.findAll()
    .then((comments) => {
      if (!comments.length) {
        return res.status(200).send({
          message: "No comments are available at the moment.",
        });
      }
      return res.status(200).send({
        message: "Comments retrieved successfully.",
        comments: comments,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while retrieving comments.",
        details: error.message,
      });
    });
};

exports.updateComment = (req, res) => {
  const id = Number(req.params.id);

  Comment.updateById(id, req.body)
    .then((updatedComment) => {
      if (!updatedComment) {
        return res.status(404).send({
          error: "Not Found",
          message: `No comment found with ID ${id}.`,
        });
      }
      return res.status(200).send({
        message: "Comment Updated Successfully.",
        comment: updatedComment,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while updating the comment.",
        details: error.message,
      });
    });
};

exports.deleteComment = (req, res) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number.",
    });
  }

  Comment.deleteById(id)
    .then((message) => {
      return res.status(200).send({ message: message });
    })
    .catch((error) => {
      if (error.kind === "not_found") {
        return res.status(404).send({
          error: "Not Found",
          message: `No record found with ID ${id}. It might have been deleted or does not exist.`,
        });
      }
      return res.status(500).send({
        error: "Server Error",
        message: "An error occurred while deleting the comment.",
        details: error.message,
      });
    });
};
