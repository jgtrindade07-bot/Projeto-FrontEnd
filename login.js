const form = document.getElementById("form-login");
const mensagem = document.getElementById("mensagem");

// Preenche o e-mail vindo do cadastro
const emailURL = new URLSearchParams(window.location.search).get("email");
if (emailURL) {
  form.email.value = emailURL;
  form.senha.focus();
}

function mostrarErro(campo, texto) {
  const bloco = campo.closest(".campo");
  bloco.querySelector(".erro").textContent = texto;
  bloco.classList.toggle("invalido", !!texto);
  campo.setAttribute("aria-invalid", texto ? "true" : "false");
  return !texto;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  mensagem.className = "mensagem";

  const email = form.email.value.trim().toLowerCase();
  const senha = form.senha.value;

  const emailOk = mostrarErro(
    form.email,
    !email ? "Informe seu e-mail."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "Digite um e-mail válido." : ""
  );
  const senhaOk = mostrarErro(form.senha, senha ? "" : "Informe sua senha.");
  if (!emailOk) return form.email.focus();
  if (!senhaOk) return form.senha.focus();

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuario) {
    mensagem.className = "mensagem falha";
    mensagem.textContent = "E-mail ou senha incorretos.";
    return;
  }

  mensagem.className = "mensagem sucesso";
  mensagem.textContent = "Bem-vindo, " + usuario.nome.split(" ")[0] + "!";
  // Quando o resto do site existir, redirecione aqui:
  // setTimeout(() => (window.location.href = "index.html"), 1200);
});
