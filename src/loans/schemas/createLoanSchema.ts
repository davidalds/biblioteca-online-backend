import { z } from 'zod';

export const createLoanSchema = z
  .object({
    bookId: z.number({ required_error: 'Campo obrigatório' }),
    userId: z.number({ required_error: 'Campo obrigatório' }),
    loan_date: z.string({ required_error: 'Campo obrigatório' }).datetime(),
    return_date: z.string({ required_error: 'Campo obrigatório' }).datetime(),
    status: z.enum(['ABERTO']),
  })
  .required();
