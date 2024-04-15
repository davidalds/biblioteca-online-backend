import { z } from 'zod';

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Titulo deve conter no minimo um caractere' }),
    author: z.any(),
    publisher: z.string(),
    publication_year: z.string().datetime(),
    ISBN: z.string(),
    genres: z.array(z.object({ id: z.number() })),
  })
  .partial();
