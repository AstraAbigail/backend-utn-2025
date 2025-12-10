import { z } from "zod"

const userSchemaValidator = z.object({
  username: z
    .string()
    .min(4, "El usuario debe tener al menos 4 carácteres")
    .regex(/[A-Z]/, "El usuario debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "El usuario debe contener al menos un número")
    .regex(/^[^\s]+$/, "El usuario no debe contener espacios"),
  email: z
    .string()
    .email("El formato del email no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe incluir al menos un número")
    .regex(/^[^\s]+$/, "El usuario no debe contener espacios"),
})

export const createUserSchema = userSchemaValidator

//futura restaurar contraseña
// export const updatedUserSchema = userSchemaValidator.partial()