const form = document.getElementById("form-login");
const mensagem = document.getElementById("mensagem");
const enviar = form.querySelector('button[type="submit"]');

let emailCadastro = new URLSearchParams(window.location.search).get("email");
try {
  emailCadastro = Usuarios.consumirEmailCadastro() || emailCadastro;
} catch {
  // O preenchimento automático é opcional.
}
if (emailCadastro) {
  form.email.value = emailCadastro;
  form.senha.focus();
}

function mostrarErro(campo, texto) {
  const bloco = campo.closest(".campo");
  bloco.querySelector(".erro").textContent = texto;
  bloco.classList.toggle("invalido", Boolean(texto));
  campo.setAttribute("aria-invalid", String(Boolean(texto)));
  return !texto;
}

function mostrarFalha(texto) {
  mensagem.className = "mensagem falha";
  mensagem.textContent = texto;
}

form.addEventListener("submit", async evento => {
  evento.preventDefault();
  if (enviar.disabled) return;
  mensagem.className = "mensagem";
  mensagem.textContent = "";

  const email = Usuarios.normalizarEmail(form.email.value);
  const senha = form.senha.value;
  const emailOk = mostrarErro(
    form.email, !email ? "Informe seu e-mail."
      : !Usuarios.emailValido(email) ? "Digite um e-mail válido." : ""
  );
  const senhaOk = mostrarErro(form.senha, senha ? "" : "Informe sua senha.");
  if (!emailOk) return form.email.focus();
  if (!senhaOk) return form.senha.focus();

  enviar.disabled = true;
  const erroCredenciais = "E-mail ou senha incorretos.";
  try {
    const usuario = Usuarios.ler().find(registro => Usuarios.normalizarEmail(registro.email) === email);
    if (!await Senha.confere(usuario, senha)) {
      mostrarFalha(erroCredenciais);
      return;
    }

    if (!usuario.credencial) {
      const credencial = await Senha.criar(senha);
      const migrado = await Usuarios.atualizar(usuarios => {
        const indice = usuarios.findIndex(registro =>
          Usuarios.normalizarEmail(registro.email) === email && registro.senha === senha
        );
        if (indice === -1) return false;
        const { nome, dataCadastro } = usuarios[indice];
        usuarios[indice] = { nome, email, dataCadastro, credencial };
        return true;
      });
      if (!migrado) {
        mostrarFalha(erroCredenciais);
        return;
      }
    } else if (!Usuarios.ler().some(registro =>
      Usuarios.normalizarEmail(registro.email) === email &&
      registro.credencial?.hash === usuario.credencial.hash
    )) {
      mostrarFalha(erroCredenciais);
      return;
    }

    Usuarios.iniciarSessao(email);
    window.location.assign("index.html");
  } catch {
    mostrarFalha("Não foi possível entrar. Verifique se o armazenamento do navegador está disponível.");
  } finally {
    enviar.disabled = false;
  }
});
