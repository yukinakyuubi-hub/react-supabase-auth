# Sistema de Autenticação e Validação de Formulários com React e Supabase

## 1. Sobre o projeto

Este projeto foi desenvolvido como atividade prática da disciplina de Frameworks Front-end. O objetivo é demonstrar a integração entre React, React Router e Supabase, utilizando autenticação de usuários, controle de acesso às páginas, validação de formulários e segurança dos dados.

Na primeira etapa, foram desenvolvidos recursos de cadastro, login, gerenciamento de sessão e proteção de rotas.

Na atividade de validação de formulários, o projeto foi aprimorado com React Hook Form e Zod, permitindo validar os dados antes do envio ao Supabase e apresentar mensagens de erro mais claras para o usuário.

## 2. Tecnologias utilizadas

- React
- Vite
- React Router
- Supabase
- Supabase Auth
- React Hook Form
- Zod
- @hookform/resolvers
- JavaScript
- Context API
- CSS

## 3. Funcionalidades

- Cadastro de usuários.
- Confirmação de e-mail.
- Login e logout.
- Gerenciamento de sessão com Context API.
- Rotas públicas e protegidas.
- Dashboard do usuário.
- Página de perfil.
- Consulta de produtos cadastrados.
- Visualização dos detalhes dos produtos.
- Cadastro de novos produtos.
- Validação de formulários com React Hook Form.
- Validação de dados com Zod.
- Mensagens de erro em português.
- Tratamento de erros retornados pelo Supabase.
- Desativação dos botões durante o envio dos formulários.
- Página 404.
- Controle de acesso com Row Level Security (RLS).

## 4. Validação de formulários

Para melhorar a validação dos dados, foram utilizadas duas ferramentas principais:

**React Hook Form:** responsável por gerenciar os formulários, controlar o envio dos dados e acompanhar os erros de preenchimento.

**Zod:** responsável por definir as regras de validação dos campos.

A integração entre as duas ferramentas é realizada por meio do `zodResolver`.

### Validação do cadastro

O formulário de cadastro possui as seguintes regras:

- Nome completo obrigatório.
- E-mail em formato válido.
- Senha com no mínimo 8 caracteres.
- Confirmação de senha igual à senha informada.

### Validação do login

O formulário de login verifica:

- E-mail em formato válido.
- Senha obrigatória.

### Tratamento de erros

Os erros são apresentados de maneira amigável, evitando exibir mensagens técnicas diretamente ao usuário.

Também são tratados erros retornados pelo Supabase, como credenciais inválidas e e-mail já cadastrado.

## 5. Cadastro de novos registros

Foi adicionada a rota protegida `/registros/novo`, permitindo cadastrar novos produtos na tabela `Produtos` do Supabase.

O formulário utiliza validação com Zod antes de enviar os dados ao banco.

Durante o envio, o botão fica desabilitado para evitar múltiplos envios. Após o cadastro, o sistema apresenta uma mensagem de sucesso ou erro e realiza o redirecionamento para a listagem de registros quando o cadastro é concluído.

Também foi adicionada a coluna `user_id` à tabela `Produtos`, permitindo associar os registros ao usuário responsável pelo cadastro.

## 6. Segurança do banco de dados

A segurança dos dados é reforçada por meio de validações no banco de dados e políticas de Row Level Security (RLS).

### Constraint CHECK

Foi criada uma restrição `CHECK` na tabela `Produtos` para limitar o tamanho do nome do produto entre 3 e 100 caracteres.

Essa validação funciona diretamente no banco de dados, impedindo que nomes fora das regras estabelecidas sejam inseridos, mesmo quando a tentativa não passa pelo formulário da aplicação.

### Política RLS

Foi criada uma política de inserção na tabela `Produtos`, utilizando `WITH CHECK` para verificar se o `user_id` do registro corresponde ao usuário autenticado por meio de `auth.uid()`.

Dessa forma, a política impede que um usuário cadastre produtos associados ao identificador de outra pessoa.

A segurança não depende apenas das validações realizadas no React.

## 7. Rotas do sistema

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Página inicial | Público |
| `/login` | Login | Público |
| `/registro` | Cadastro de usuários | Público |
| `/dashboard` | Painel do usuário | Protegido |
| `/registros` | Lista de produtos | Protegido |
| `/registros/novo` | Cadastro de novo produto | Protegido |
| `/registros/:id` | Detalhes do produto | Protegido |
| `/perfil` | Perfil do usuário | Protegido |

## 8. Configuração do Supabase

Para conectar a aplicação ao Supabase, é necessário criar um arquivo chamado `.env` na pasta principal do projeto.

Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

Substitua os valores pelos dados do seu projeto Supabase.

**Importante:** o arquivo `.env` não deve ser enviado ao GitHub. Ele deve permanecer incluído no `.gitignore` para evitar a exposição das configurações.

Não compartilhe senhas, chaves privadas ou chaves secretas de administração.

## 9. Como executar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/yukinakyuubi-hub/react-supabase-auth.git
```

2. Acesse a pasta do projeto:

```bash
cd react-supabase-auth
```

3. Instale as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente no arquivo `.env`.

5. Execute a aplicação:

```bash
npm run dev
```

6. Acesse o endereço disponibilizado pelo Vite.

## 10. Teste da validação diretamente no banco de dados — Etapa 5

Nesta etapa, foram realizados testes para verificar se as regras de validação e segurança do banco de dados funcionam mesmo quando as tentativas de inserção são feitas sem utilizar o formulário da aplicação.

### Teste da constraint CHECK

Foi realizada uma tentativa de inserir um produto diretamente pelo SQL Editor do Supabase, utilizando um nome com apenas um caractere.

Comando utilizado:

```sql
INSERT INTO public."Produtos" (nome)
VALUES ('A');
```

**Resultado obtido:**

```text
violates check constraint
"produtos_nome_tamanho_check"
```

O banco de dados bloqueou a inserção porque o nome informado não respeitava a regra de tamanho entre 3 e 100 caracteres.

Esse resultado comprovou que a constraint `CHECK` está funcionando corretamente.

### Teste da política RLS

Também foi realizado um teste simulando um usuário autenticado que tentou inserir um produto utilizando um `user_id` diferente do seu próprio identificador.

**Resultado obtido:**

```text
ERRO: 42501: a nova linha viola a política de segurança em nível de linha para a tabela "Produtos"
```

O Supabase bloqueou a operação porque o identificador informado não correspondia ao usuário autenticado.

O teste foi realizado utilizando uma transação com `ROLLBACK`, garantindo que nenhum produto de teste fosse mantido no banco de dados.

Esse resultado comprovou que a política RLS com `WITH CHECK` está funcionando corretamente.

### Conclusão dos testes

Os dois testes demonstraram que o banco de dados consegue bloquear tanto dados que não respeitam as regras de validação quanto operações que não atendem às políticas de segurança.

Isso demonstra a importância de realizar validações também no banco de dados, pois a validação no front-end, sozinha, não garante a segurança das informações.

## 11. Perguntas e respostas

**1. Qual a vantagem de utilizar React Hook Form em vez de controlar cada campo com useState?**

O React Hook Form facilita o gerenciamento dos formulários, reduz a necessidade de criar vários estados e ajuda a controlar validações, erros e envio dos dados de maneira organizada.

**2. Qual é o papel do Zod e do zodResolver na validação?**

O Zod define as regras que os campos precisam seguir. Já o zodResolver conecta essas regras ao React Hook Form, permitindo que as validações sejam executadas automaticamente.

**3. Por que a validação no front-end não é suficiente para garantir a segurança dos dados?**

Porque os dados podem ser enviados diretamente ao banco, sem passar pelo formulário. Por isso, também é necessário utilizar regras e restrições no próprio banco de dados.

**4. Qual é a diferença entre um erro de validação do formulário e um erro retornado pelo Supabase?**

O erro de validação acontece quando o usuário preenche algum campo de maneira incorreta, como informar um e-mail inválido. Já o erro do Supabase acontece durante uma operação com o serviço, como uma tentativa de login com credenciais inválidas ou uma inserção não autorizada.

**5. Por que o sistema deve apresentar uma mensagem genérica quando as credenciais do login são inválidas?**

Para evitar revelar informações sobre a existência de contas cadastradas. Assim, o sistema não facilita a descoberta de e-mails registrados por pessoas não autorizadas.

**6. Qual é a função das constraints e do RLS com WITH CHECK no banco de dados?**

As constraints definem regras que os dados precisam respeitar, como o tamanho permitido de um campo. O RLS controla quais operações cada usuário pode realizar, enquanto o `WITH CHECK` verifica se os dados enviados atendem às condições estabelecidas para a operação.

## 12. Dificuldades encontradas

Durante o desenvolvimento, algumas dificuldades estiveram relacionadas à configuração do Supabase, à integração entre as ferramentas utilizadas e à identificação de erros nos formulários e nas operações com o banco de dados.

Também foi necessário corrigir configurações da tabela, adicionar a coluna `user_id` e compreender como as validações do front-end se relacionam com as regras de segurança do banco de dados.

Essas situações contribuíram para melhorar o entendimento sobre a integração entre React, React Hook Form, Zod e Supabase.

## 13. Fontes de consulta

- [Documentação oficial do React](https://react.dev/)
- [Documentação do React Router](https://reactrouter.com/)
- [Documentação do React Hook Form](https://react-hook-form.com/)
- [Documentação do Zod](https://zod.dev/)
- [Documentação do Supabase](https://supabase.com/docs)

## 14. Considerações finais

O desenvolvimento deste projeto permitiu compreender melhor como criar uma aplicação React integrada ao Supabase, utilizando autenticação, gerenciamento de sessão, proteção de rotas e operações com banco de dados.

Com a nova atividade, também foi possível aprender a utilizar React Hook Form e Zod para validar formulários, tratar erros e organizar melhor o envio das informações.

Além disso, a implementação de constraints e políticas RLS demonstrou a importância de proteger os dados diretamente no banco de dados.

Dessa forma, o projeto reúne conhecimentos importantes para o desenvolvimento de aplicações web mais organizadas e seguras.
