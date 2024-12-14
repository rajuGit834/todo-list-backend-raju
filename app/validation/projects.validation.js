const yup = require("yup");

const projectSchema = yup.object({
  project_name: yup
    .string()
    .min(3, "Project name must be at least 3 characters long")
    .max(50, "Project name must not exceed characters")
    .matches(/^(?!\s*$).+/, "Project name cannot be empty or only whitespace"),
  color: yup
    .string()
    .min(3, "Color name must be at least 3 characters long")
    .max(20, "Color name must not exceed 20 characters")
    .matches(/^(?!\s*$).+/, "Project name cannot be empty or only whitespace"),
  is_favorite: yup.boolean().required("is_favorite field is required"),
  user_id: yup
    .number()
    .positive("User ID must be positive")
    .integer("User ID must be an integer"),
});

const projectValidation = (req, res, next) => {
  const id = Number(req.params.id);
  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing.",
      message:
        "The request body is required. Please provide the necessary data in the body of the request.",
    });
  }
  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The Id Must be a positive number.",
    });
  }
  projectSchema
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

module.exports = projectValidation;
