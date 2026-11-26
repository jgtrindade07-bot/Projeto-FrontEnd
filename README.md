# Sistema de Academia: 
# Academia das Maravilhas

Projeto prático da disciplina de **Programação Web Front-end**. O site apresenta as modalidades e os planos de uma academia fictícia, simula o cadastro e o login de alunos e oferece um painel para gerenciar usuários. Os currículos dos integrantes ficam disponíveis pelo rodapé.

## 🚀 Começando

### 📋 Pré-requisitos

- Navegador atualizado, como Chrome ou Firefox.
- Python 3 para executar o servidor local.

### 🔧 Instalação

1. Extraia o ZIP do projeto e abra o terminal na pasta que contém `index.html`.
2. Execute o comando para iniciar o servidor local.

   ```bash
   python -m http.server 8000
   ```

3. Abra [http://localhost:8000](http://localhost:8000) no navegador.

Para uma demonstração rápida, abra **Admin** no menu, cadastre um nome e um e-mail fictícios e recarregue a página. O registro continuará na lista, com a data do cadastro.

## ⚙️ Executando os testes

### 🔩 Testes de ponta a ponta

Com o servidor local em execução, teste os fluxos a seguir no navegador.

1. Em **Cadastre-se**, preencha o formulário com dados fictícios. Confirme que o cadastro leva à tela de login e que é possível entrar com a conta criada.
2. Em **Admin**, cadastre dois usuários e recarregue a página. Confira se os registros continuam na lista e se estão na chave `usuarios` do Local Storage, no formato `{"usuarios":[...]}`.
3. Pesquise por nome e por e-mail. Use **Limpar campos** para esvaziar o formulário e depois teste **Excluir** e **Excluir todos** com os registros fictícios.
4. No rodapé, abra **Currículo** e confira os quatro links da equipe.

### ⌨️ Validação de HTML e CSS

Valide os arquivos `.html` e `.css` nos serviços do W3C. [Validador HTML](https://validator.w3.org/) · [Validador CSS](https://jigsaw.w3.org/css-validator/)

## 📦 Implantação

1. Envie os arquivos do projeto para a raiz da branch `main`, mantendo o `index.html` e o `.nojekyll` na mesma pasta.
2. No GitHub, abra **Settings → Pages**, selecione **Deploy from a branch** e escolha **main** e **/(root)**.
3. Quando a publicação estiver concluída, abra o endereço exibido em **Settings → Pages**.

## 🛠️ Construído com

- **HTML5** para estrutura semântica, formulários e navegação.
- **CSS3** para o layout responsivo e os estilos das páginas.
- **JavaScript** e **DOM API** para validação de formulários, pesquisa e atualização da lista.
- **Web Storage API** para salvar os registros no Local Storage e manter a sessão de demonstração no Session Storage.
- **Web Crypto API** para gerar e verificar o hash das senhas da demonstração.

## 📁 Estrutura do projeto

| Arquivo ou pasta | Finalidade |
| --- | --- |
| `index.html`, `index.css`, `index.js` | Página principal, modalidades, planos e menu |
| `cadastro.html`, `cadastro.js` | Formulário e validação do cadastro |
| `login.html`, `login.js` | Login de demonstração |
| `admin.html`, `admin.css`, `admin.js` | Cadastro, listagem, pesquisa e exclusão de usuários |
| `usuarios.js`, `senha.js` | Armazenamento, sessão e verificação de senhas |
| `style.css` | Estilos compartilhados |
| `curriculo.html`, `curriculos/` | Índice e páginas individuais dos currículos |
| `imagens/` | Ilustrações das modalidades |
| `.nojekyll` | Configuração da publicação estática |

## 🖇️ Colaborando

Para propor uma alteração, abra um pull request com a descrição da mudança e dos testes que você realizou. [Repositório do projeto](https://github.com/jgtrindade07-bot/Projeto-FrontEnd)

## 📌 Versão

As alterações podem ser acompanhadas no [histórico de commits da branch main](https://github.com/jgtrindade07-bot/Projeto-FrontEnd/commits/main/).

## ✒️ Autores

- **Gabriel Peixoto de Souza** [GitHub](https://github.com/gabrielp-s)
- **Felipe Bonani Custodio** [GitHub](https://github.com/Felipebonani)
- **Daniel Kenji Taguti** [GitHub](https://github.com/DanKenTa)
- **João Gabriel Odorizzio Trindade** [GitHub](https://github.com/jgtrindade07-bot)

## 📄 Licença

Licença a definir pela equipe.

## 🎁 Agradecimentos

Documentação adaptada do [modelo de README de Armstrong Lohãns](https://gist.github.com/lohhans/f8da0b147550df3f96914d3797e9fb89).