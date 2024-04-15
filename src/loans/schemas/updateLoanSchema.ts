import { z } from 'zod';

export const updateLoanSchema = z
  .object({
    bookId: z.number(),
    userId: z.number(),
    loan_date: z.string().datetime(),
    return_date: z.string().datetime(),
  })
  .partial();
