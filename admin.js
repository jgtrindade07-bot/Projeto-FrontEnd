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

/* ---------- Utilidades ---------- */

function formatarData(iso) {
  const data = new Date(iso);
  if (!iso || Number.isNaN(data.getTime())) return "Data de cadastro indisponível";
  return "Cadastrado em " + data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
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
  let usuarios;
  try {
    usuarios = Usuarios.ler();
  } catch {
    listaEl.replaceChildren();
    contadorEl.textContent = "—";
    vazioEl.hidden = true;
    semResultadosEl.hidden = true;
    excluirTodosEl.disabled = true;
    mostrarMensagemLista("Não foi possível carregar os usuários salvos.", "falha");
    return;
  }
  const termo = normalizarPesquisa(pesquisaEl.value);
  const resultados = usuarios.filter((usuario) =>
    normalizarPesquisa(usuario.nome).includes(termo) ||
    normalizarPesquisa(usuario.email).includes(termo)
  );

  listaEl.replaceChildren();
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
    data.textContent = formatarData(usuario.dataCadastro);

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

async function excluirUsuario(email, indiceVisivel) {
  try {
    const excluido = await Usuarios.atualizar(usuarios => {
      const indice = usuarios.findIndex(usuario => usuario.email === email);
      if (indice === -1) return false;
      usuarios.splice(indice, 1);
      return true;
    });

    renderizarLista();
    if (!excluido) return;
    mostrarMensagemLista("Usuário excluído.", "sucesso");
    const botoes = listaEl.querySelectorAll(".usuario__excluir");
    const proximo = botoes[indiceVisivel] || botoes[indiceVisivel - 1] || pesquisaEl;
    proximo.focus();
  } catch {
    mostrarMensagemLista("Não foi possível salvar a exclusão neste navegador.", "falha");
  }
}

pesquisaEl.addEventListener("input", () => {
  mostrarMensagemLista("");
  renderizarLista();
});

excluirTodosEl.addEventListener("click", async () => {
  const confirmou = window.confirm(
    "Excluir todos os usuários cadastrados, inclusive os que não aparecem na pesquisa?"
  );
  if (!confirmou) return;

  try {
    await Usuarios.atualizar(usuarios => { usuarios.length = 0; });
    renderizarLista();
    mostrarMensagemLista("Todos os usuários foram excluídos.", "sucesso");
    pesquisaEl.focus();
  } catch {
    mostrarMensagemLista("Não foi possível salvar a exclusão neste navegador.", "falha");
  }
});

function marcarInvalido(campo, texto) {
  campo.setAttribute("aria-invalid", "true");
  mostrarMensagem(texto, "falha");
  campo.focus();
}

form.addEventListener("reset", () => {
  inputNome.removeAttribute("aria-invalid");
  inputEmail.removeAttribute("aria-invalid");
  mostrarMensagem("", "");
  inputNome.focus();
});

const enviar = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async evento => {
  evento.preventDefault();
  if (enviar.disabled) return;

  const nome = inputNome.value.trim();
  const email = Usuarios.normalizarEmail(inputEmail.value);
  inputNome.removeAttribute("aria-invalid");
  inputEmail.removeAttribute("aria-invalid");

  if (!nome) return marcarInvalido(inputNome, "Informe o nome do usuário.");
  if (!Usuarios.emailValido(email)) {
    return marcarInvalido(inputEmail, "Informe um e-mail válido, como nome@exemplo.com.");
  }

  enviar.disabled = true;
  try {
    const salvo = await Usuarios.atualizar(usuarios => {
      if (usuarios.some(usuario => Usuarios.normalizarEmail(usuario.email) === email)) return false;
      usuarios.push({ nome, email, dataCadastro: new Date().toISOString() });
      return true;
    });

    if (!salvo) return marcarInvalido(inputEmail, "Este e-mail já está cadastrado.");
    form.reset();
    pesquisaEl.value = "";
    mostrarMensagemLista("");
    renderizarLista();
    mostrarMensagem("Usuário cadastrado.", "sucesso");
  } catch {
    mostrarMensagem("Não foi possível salvar o usuário neste navegador.", "falha");
  } finally {
    enviar.disabled = false;
  }
});

window.addEventListener("storage", evento => {
  if (evento.key === Usuarios.chave || evento.key === null) renderizarLista();
});

renderizarLista();
