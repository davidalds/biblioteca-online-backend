import { z } from 'zod';

export const closeLoanSchema = z
  .object({
    loanStatus: z.enum(['FECHADO']),
  })
  .required();
