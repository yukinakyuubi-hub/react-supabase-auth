# Sistema de Autenticação com React e Supabase

## 1. Sobre o projeto

Este projeto foi desenvolvido como atividade prática para demonstrar a integração entre React, React Router e Supabase, utilizando autenticação de usuários e controle de acesso às páginas.

## 2. Tecnologias utilizadas

- React
- Vite
- React Router
- Supabase
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
- Página 404.
- Controle de acesso com Row Level Security (RLS).

## 4. Segurança

A autenticação é realizada pelo Supabase Auth.

A Context API mantém as informações do usuário autenticado.

As rotas protegidas impedem que usuários não autenticados acessem páginas privadas.

O RLS está habilitado na tabela Produtos, permitindo a consulta por usuários autenticados.

## 5. Rotas do sistema

| Rota             | Descrição           | Acesso    |
| ---------------- | ------------------- | --------- |
| `/`              | Página inicial      | Público   |
| `/login`         | Login               | Público   |
| `/registro`      | Cadastro            | Público   |
| `/dashboard`     | Painel do usuário   | Protegido |
| `/registros`     | Lista de produtos   | Protegido |
| `/registros/:id` | Detalhes do produto | Protegido |
| `/perfil`        | Perfil do usuário   | Protegido |

## 6. Configuração do Supabase

Para conectar a aplicação ao Supabase, é necessário criar um arquivo chamado `.env` na pasta principal do projeto.

Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

Substitua os valores pelos dados do seu projeto Supabase.

**Importante:** o arquivo `.env` não deve ser enviado ao GitHub. Ele está incluído no `.gitignore` para evitar a exposição das configurações.

Não compartilhe chaves privadas, senhas ou chaves secretas de administração.

## 7. Como executar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`.

3. Execute a aplicação:

```bash
npm run dev
```

4. Acesse o endereço disponibilizado pelo Vite.

## 8. Considerações sobre a segurança

A aplicação utiliza o Supabase Auth para autenticar os usuários e o React Router para controlar o acesso às páginas privadas.

Além disso, a tabela Produtos possui Row Level Security (RLS) habilitado, permitindo consultas por usuários autenticados conforme a política configurada no Supabase.

## 9. Perguntas e respostas

**1. Qual é a responsabilidade do Supabase Auth dentro da aplicação?**

O Supabase Auth é responsável por gerenciar a autenticação dos usuários. Ele permite criar contas, realizar login, encerrar sessões e verificar a identidade de quem está acessando o sistema.

**2. Por que utilizamos a Context API para compartilhar as informações do usuário autenticado?**

Utilizamos a Context API para compartilhar as informações do usuário entre diferentes componentes da aplicação. Assim, não precisamos buscar os dados de autenticação novamente em cada página.

**3. Qual é a diferença entre utilizar `useState` diretamente em cada componente e utilizar um contexto global de autenticação?**

O `useState` controla informações dentro de um componente específico. Já o contexto global permite compartilhar informações, como os dados do usuário autenticado, entre vários componentes da aplicação.

**4. O que acontece quando um usuário tenta acessar uma rota protegida sem estar autenticado?**

O componente ProtectedRoute verifica se existe um usuário autenticado. Caso não exista, o usuário é redirecionado para a página de login, sem conseguir acessar o conteúdo privado.

**5. Qual é a função do método `onAuthStateChange()`?**

Esse método acompanha as alterações no estado de autenticação do usuário, como login e logout. Quando ocorre uma mudança, ele permite atualizar as informações armazenadas no contexto de autenticação.

**6. Por que a proteção de rotas com React Router não é suficiente para garantir a segurança dos dados?**

Porque a proteção do React Router controla apenas o acesso às páginas da aplicação. Para proteger os dados armazenados no banco, também precisamos utilizar políticas de segurança RLS no Supabase.

**7. Qual é a diferença entre autenticação e autorização?**

Autenticação é o processo de verificar quem é o usuário, por exemplo, por meio de e-mail e senha. Autorização é a definição do que esse usuário pode acessar ou realizar dentro do sistema.

## 10. Considerações finais

A realização desta atividade permitiu compreender melhor como funciona a autenticação em uma aplicação React integrada ao Supabase.

Durante o desenvolvimento, foram utilizados conceitos como React Router, Context API, useState, useEffect e Supabase Auth.

Também foi possível aprender a criar contas, realizar login e logout, manter a sessão do usuário e proteger páginas que exigem autenticação.

Com isso, consegui compreender melhor como esses recursos trabalham juntos para desenvolver uma aplicação mais organizada e segura.
