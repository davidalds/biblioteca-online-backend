import { z } from 'zod';

export const createUserSchema = z
  .object({
    first_name: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    last_name: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    email: z
      .string({ required_error: 'Campo obrigatório' })
      .email({ message: 'E-mail deve ser válido' }),
    password: z.string({ required_error: 'Campo obrigatório' }).min(5),
    user_type: z.enum(['ADMNISTRADOR', 'BIBLIOTECARIO', 'LEITOR']),
  })
  .required();
