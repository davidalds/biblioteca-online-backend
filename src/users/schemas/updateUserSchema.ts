import { z } from 'zod';

export const updateUserSchema = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email({ message: 'E-mail deve ser válido' }),
    password: z.string(),
    user_type: z.enum(['ADMNISTRADOR', 'BIBLIOTECARIO', 'LEITOR']),
  })
  .partial();
