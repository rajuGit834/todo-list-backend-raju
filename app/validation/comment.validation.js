const yup = require("yup");

const commentSchema = yup.object({
  content: yup.string().min(1).max(200).required("Content is required"),
  project_id: yup
    .number()
    .positive("Project ID must be positive")
    .integer("Project id must be an integer")
    .required("Project ID is required"),

  task_id: yup
    .number()
    .positive("Task ID must be positive")
    .integer("Task id must be an integer"),
});

const commentValidation = (req, res, next) => {
  const id = Number(req.params.id);

  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing.",
      message: "Please provide the required data in the request body.",
    });
  }

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number.",
    });
  }

  commentSchema
    .validate(req.body, { abortEarly: false })
    .then(() => {
      next();
    })
    .catch((error) => {
      const validationErrors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(400).send({ errors: validationErrors });
    });
};

module.exports = commentValidation;
