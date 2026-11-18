
import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),

  descricao: z
    .string()
    .trim()
    .min(5, 'A descrição deve ter pelo menos 5 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),

  preco: z.coerce
    .number()
    .positive('O preço deve ser maior que zero.'),

  categoria: z
    .string()
    .trim()
    .min(1, 'Informe a categoria do produto.'),

  estoque: z.coerce
    .number()
    .int('O estoque deve ser um número inteiro.')
    .min(0, 'O estoque não pode ser negativo.'),
});
