import { z } from 'zod';

export const createGenreSchema = z
  .object({
    title: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    description: z.string().optional(),
  })
  .required();
