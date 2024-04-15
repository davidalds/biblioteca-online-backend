import { z } from 'zod';

export const updateGenreSchema = z
  .object({
    title: z.string(),
    description: z.string(),
  })
  .partial();
