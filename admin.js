// Chave única do Local Storage: guarda um array de usuários em JSON
const CHAVE_STORAGE = "usuarios";

const form = document.getElementById("form-usuario");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const mensagem = document.getElementById("mensagem");
const listaEl = document.getElementById("lista-usuarios");
const vazioEl = document.getElementById("lista-vazia");
const contadorEl = document.getElementById("contador");

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

function renderizarLista() {
  const usuarios = carregarUsuarios();

  listaEl.innerHTML = "";
  contadorEl.textContent = usuarios.length;
  vazioEl.hidden = usuarios.length > 0;

  usuarios.forEach((u) => {
    const li = document.createElement("li");
    li.className = "usuario";

    const info = document.createElement("div");

    const nome = document.createElement("p");
    nome.className = "usuario__nome";
    nome.textContent = u.nome;

    const email = document.createElement("p");
    email.className = "usuario__email";
    email.textContent = u.email;

    info.append(nome, email);

    const data = document.createElement("p");
    data.className = "usuario__data";
    data.textContent = "Cadastrado em " + formatarData(u.dataCadastro);

    li.append(info, data);
    listaEl.appendChild(li);
  });
}

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

  if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    inputEmail.classList.add("invalido");
    mostrarMensagem("Este e-mail já está cadastrado.", "erro");
    inputEmail.focus();
    return;
  }

  usuarios.push({
    nome: nome,
    email: email,
    dataCadastro: new Date().toISOString(), // data e hora do cadastro
  });

  salvarUsuarios(usuarios);
  renderizarLista();

  form.reset();
  inputNome.focus();
  mostrarMensagem("Usuário cadastrado.", "sucesso");
});

// Exibe os usuários já salvos ao abrir a página
renderizarLista();
