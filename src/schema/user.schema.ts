import { object, string, ref } from 'yup';

export const createUserSchema = object({
    body: object({
      name: string().trim().required("Name is required"),
      password: string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum."),
      passwordConfirmation: string().required("Password Confirmation is required").oneOf(
        [ref("password"), null],
        "Passwords must match"),
      email: string().trim()
        .email("Must be a valid email")
        .required("Email is required"),
    }),
});

export const userLoginSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum."),

    email: string().trim()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});