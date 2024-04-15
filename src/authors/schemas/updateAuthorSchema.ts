import { z } from 'zod';

export const UpdateAuthorSchema = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    birth_year: z.string().datetime(),
    nationality: z.string(),
  })
  .partial();
