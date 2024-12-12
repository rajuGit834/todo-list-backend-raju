const yup = require("yup");

const userSchema = yup.object({
  user_name: yup
    .string()
    .min(3, "User name must be at least 3 characters long")
    .max(50, "User name must not exceed 50 characters")
    .matches(/^[A-Za-z\s]+$/, "User name must only contain letters and spaces")
    .required("User name is required"),
  user_email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const userValidation = (req, res, next) => {
  const id = Number(req.params.id);

  if (id <= 0) {
    return res.status(400).send({
      error: "Invalid ID",
      message: "The ID must be a positive number and greater than 0.",
    });
  }

  userSchema
    .validate(req.body, { abortEarly: false })
    .then(() => {
      next();
    })
    .catch((error) => {
      const validationErrors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return res.status(400).send({ errors: validationErrors });
    });
};

module.exports = userValidation;
