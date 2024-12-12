const yup = require("yup");

const taskSchema = yup.object({
  content: yup
    .string()
    .min(3, "Content must be at least 3 characters long")
    .max(50, "Content must not exceed 50 characters")
    .required("Content is required"),
  description: yup
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(100, "Description must not exceed 100 characters")
    .required("Description is required"),
  due_date: yup
    .date()
    .min(new Date(), "Due Date must be a future date")
    .required("Due Date is require"),
  is_completed: yup.boolean().required("Is_completed is require"),
  project_id: yup
    .number()
    .positive("Project ID must be positive")
    .integer("Project ID must be an integer"),
});

const taskValidation = (req, res, next) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({ message: "Id Must be a positive number." });
  }
  
  taskSchema
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

module.exports = taskValidation;
