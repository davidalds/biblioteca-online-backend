import { z } from 'zod';

export const CreateAuthorSchema = z
  .object({
    first_name: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    last_name: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
    birth_year: z
      .string({ required_error: 'Campo obrigatório' })
      .datetime({ message: 'Formato de data inválido' }),
    nationality: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, { message: 'Deve conter no mínimo 1 caractere' }),
  })
  .required();
