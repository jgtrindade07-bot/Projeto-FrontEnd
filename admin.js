// Chave única do Local Storage: guarda um array de usuários em JSON
const CHAVE_STORAGE = "usuarios";

const form = document.getElementById("form-usuario");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const mensagem = document.getElementById("mensagem");
const listaEl = document.getElementById("lista-usuarios");
const vazioEl = document.getElementById("lista-vazia");
const contadorEl = document.getElementById("contador");
const pesquisaEl = document.getElementById("pesquisa-usuario");
const excluirTodosEl = document.getElementById("excluir-todos");
const mensagemListaEl = document.getElementById("mensagem-lista");
const semResultadosEl = document.getElementById("sem-resultados");
const modeloExcluirEl = document.getElementById("modelo-excluir-usuario");

/* ---------- Local Storage ---------- */

function carregarUsuarios() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(usuarios));
}

/* ---------- Utilidades ---------- */

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + tipo;
}

/* ---------- Exibição da lista ---------- */

function normalizarPesquisa(texto) {
  return texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function renderizarLista() {
  const usuarios = carregarUsuarios();
  const termo = normalizarPesquisa(pesquisaEl.value);
  const resultados = usuarios.filter((usuario) =>
    normalizarPesquisa(usuario.nome).includes(termo) ||
    normalizarPesquisa(usuario.email).includes(termo)
  );

  listaEl.innerHTML = "";
  contadorEl.textContent = termo
    ? resultados.length + " de " + usuarios.length
    : usuarios.length;
  vazioEl.hidden = usuarios.length > 0;
  semResultadosEl.hidden = usuarios.length === 0 || resultados.length > 0;
  excluirTodosEl.disabled = usuarios.length === 0;

  resultados.forEach((usuario, indice) => {
    const li = document.createElement("li");
    li.className = "usuario";

    const info = document.createElement("div");
    info.className = "usuario__info";

    const nome = document.createElement("p");
    nome.className = "usuario__nome";
    nome.textContent = usuario.nome;

    const email = document.createElement("p");
    email.className = "usuario__email";
    email.textContent = usuario.email;

    info.append(nome, email);

    const data = document.createElement("p");
    data.className = "usuario__data";
    data.textContent = "Cadastrado em " + formatarData(usuario.dataCadastro);

    const excluir = modeloExcluirEl.content.firstElementChild.cloneNode(true);
    excluir.setAttribute("aria-label", "Excluir " + usuario.nome + " (" + usuario.email + ")");
    excluir.addEventListener("click", () => excluirUsuario(usuario.email, indice));

    const acoes = document.createElement("div");
    acoes.className = "usuario__acoes";
    acoes.append(data, excluir);

    li.append(info, acoes);
    listaEl.appendChild(li);
  });
}

/* ---------- Gerenciamento de usuários ---------- */

function mostrarMensagemLista(texto, tipo = "") {
  mensagemListaEl.textContent = texto;
  mensagemListaEl.className = "mensagem lista__mensagem " + tipo;
}

function atualizarAposExclusao(usuarios, texto) {
  try {
    salvarUsuarios(usuarios);
  } catch (erro) {
    mostrarMensagemLista("Não foi possível salvar a exclusão neste navegador.", "erro");
    return false;
  }

  renderizarLista();
  mostrarMensagemLista(texto, "sucesso");
  return true;
}

function excluirUsuario(email, indiceVisivel) {
  const usuarios = carregarUsuarios();
  const indice = usuarios.findIndex((usuario) => usuario.email === email);
  if (indice === -1) return;

  usuarios.splice(indice, 1);
  if (atualizarAposExclusao(usuarios, "Usuário excluído.")) {
    const botoes = listaEl.querySelectorAll(".usuario__excluir");
    const proximo = botoes[indiceVisivel] || botoes[indiceVisivel - 1] || pesquisaEl;
    proximo.focus();
  }
}

pesquisaEl.addEventListener("input", () => {
  mostrarMensagemLista("");
  renderizarLista();
});

excluirTodosEl.addEventListener("click", () => {
  if (carregarUsuarios().length === 0) return;

  const confirmou = window.confirm(
    "Excluir todos os usuários cadastrados, inclusive os que não aparecem na pesquisa?"
  );
  if (!confirmou) return;

  if (atualizarAposExclusao([], "Todos os usuários foram excluídos.")) {
    pesquisaEl.focus();
  }
});

form.addEventListener("reset", () => {
  inputNome.classList.remove("invalido");
  inputEmail.classList.remove("invalido");
  mostrarMensagem("", "");
  inputNome.focus();
});

/* ---------- Cadastro ---------- */

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();

  inputNome.classList.remove("invalido");
  inputEmail.classList.remove("invalido");

  if (!nome) {
    inputNome.classList.add("invalido");
    mostrarMensagem("Informe o nome do usuário.", "erro");
    inputNome.focus();
    return;
  }

  if (!emailValido(email)) {
    inputEmail.classList.add("invalido");
    mostrarMensagem("Informe um e-mail válido, como nome@exemplo.com.", "erro");
    inputEmail.focus();
    return;
  }

  const usuarios = carregarUsuarios();

  if (usuarios.some((usuario) => usuario.email.toLowerCase() === email.toLowerCase())) {
    inputEmail.classList.add("invalido");
    mostrarMensagem("Este e-mail já está cadastrado.", "erro");
    inputEmail.focus();
    return;
  }

  usuarios.push({
    nome: nome,
    email: email,
    dataCadastro: new Date().toISOString(),
  });

  salvarUsuarios(usuarios);
  renderizarLista();

  form.reset();
  mostrarMensagem("Usuário cadastrado.", "sucesso");
});

// Exibe os usuários já salvos ao abrir a página
renderizarLista();