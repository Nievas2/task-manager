import { z } from "zod"

export const columnSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título es requerido" })
    .max(20, { message: "El título no puede tener más de 20 caracteres" }),
})
