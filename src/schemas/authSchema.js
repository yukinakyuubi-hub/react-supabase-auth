
import { z } from 'zod';

export const cadastroSchema = z
  .object({
    nome: z.string().min(1, 'Informe seu nome completo.'),
    email: z
      .string()
      .min(1, 'Informe seu e-mail.')
      .email('Digite um e-mail válido.'),
    senha: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirmarSenha: z
      .string()
      .min(1, 'Confirme sua senha.'),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu e-mail.')
    .email('Digite um e-mail válido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
});
