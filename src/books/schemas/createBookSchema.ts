import { z } from 'zod';

export const createBookSchema = z
  .object({
    title: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    author: z.any({ required_error: 'Campo obrigatório' }),
    publisher: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    publication_year: z
      .string({ required_error: 'Campo obrigatório' })
      .datetime({ message: 'Formato de data inválido' }),
    ISBN: z
      .string({ required_error: 'Campo obrigatório' })
      .regex(/^\d{3}-\d{2}-\d{3}-\d{4}-\d$/, {
        message: 'Formatação inválida',
      }),
    genres: z.array(
      z.object({ id: z.number({ required_error: 'Campo obrigatório' }) })
    ),
  })
  .required();
