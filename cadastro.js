const form = document.getElementById("form-cadastro");
const mensagem = document.getElementById("mensagem");
const blocoResp = document.getElementById("bloco-responsavel");

/* ---------- Máscaras ---------- */
function mascaraCPF(v) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function mascaraTelefone(v) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
form.cpf.addEventListener("input", e => (e.target.value = mascaraCPF(e.target.value)));
form.telefone.addEventListener("input", e => (e.target.value = mascaraTelefone(e.target.value)));

/* ---------- Validadores: retornam "" se ok, ou a mensagem de erro ---------- */
function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(cpf[i]) * (t + 1 - i);
    const dv = ((soma * 10) % 11) % 10;
    if (dv !== Number(cpf[t])) return false;
  }
  return true;
}

function idadeEmAnos(dataISO) {
  const nasc = new Date(dataISO + "T00:00:00");
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

const validadores = {
  nome(v) {
    v = v.trim();
    if (!v) return "Informe seu nome completo.";
    if (v.split(/\s+/).length < 2) return "Digite nome e sobrenome.";
    return "";
  },
  email(v) {
    v = v.trim();
    if (!v) return "Informe seu e-mail.";
    if (!Usuarios.emailValido(v)) return "Digite um e-mail válido, como nome@email.com.";
    return "";
  },
  cpf(v) {
    if (!v) return "Informe seu CPF.";
    if (!cpfValido(v)) return "CPF inválido. Confira os números.";
    return "";
  },
  nascimento(v) {
    if (!v) return "Informe sua data de nascimento.";
    const idade = idadeEmAnos(v);
    if (isNaN(idade) || idade < 0) return "Data inválida.";
    if (idade < 12) return "A idade mínima é 12 anos.";
    if (idade > 110) return "Data inválida.";
    return "";
  },
  responsavel(v) {
    if (blocoResp.hidden) return "";
    v = v.trim();
    if (!v) return "Informe o nome do responsável.";
    if (v.split(/\s+/).length < 2) return "Digite nome e sobrenome do responsável.";
    return "";
  },
  autorizacao() {
    if (blocoResp.hidden) return "";
    return form.autorizacao.checked ? "" : "Confirme que um responsável vai acompanhar você.";
  },
  telefone(v) {
    if (!v) return "Informe seu celular.";
    if (v.replace(/\D/g, "").length !== 11) return "Use DDD + 9 dígitos: (00) 00000-0000.";
    return "";
  },
  senha(v) {
    if (!v) return "Crie uma senha.";
    if (v.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Use letras e números na senha.";
    return "";
  },
  confirma(v) {
    if (!v) return "Repita a senha.";
    if (v !== form.senha.value) return "As senhas não são iguais.";
    return "";
  },
  termos() {
    return form.termos.checked ? "" : "Confirme que você entende como o cadastro funciona.";
  },
};

/* ---------- Exibição de erro/sucesso por campo ---------- */
function validarCampo(nome) {
  const input = form[nome];
  if (input.closest("[hidden]")) return true; // campo oculto não é validado
  const valor = input.type === "checkbox" ? input.checked : input.value;
  const erro = validadores[nome](valor);
  const bloco = input.closest(".campo");
  bloco.querySelector(".erro").textContent = erro;
  bloco.classList.toggle("invalido", !!erro);
  bloco.classList.toggle("valido", !erro);
  input.setAttribute("aria-invalid", erro ? "true" : "false");
  return !erro;
}

function limparEstado() {
  form.querySelectorAll(".campo").forEach(c => {
    c.classList.remove("invalido", "valido");
    c.querySelector(".erro").textContent = "";
    c.querySelector("input").removeAttribute("aria-invalid");
  });
  mensagem.className = "mensagem";
  mensagem.textContent = "";
}

Object.keys(validadores).forEach(nome => {
  const input = form[nome];
  input.addEventListener("blur", () => validarCampo(nome));
  // Depois do primeiro erro, revalida enquanto digita
  input.addEventListener("input", () => {
    if (input.closest(".campo").classList.contains("invalido")) validarCampo(nome);
  });
});
form.senha.addEventListener("input", () => {
  if (form.confirma.value) validarCampo("confirma");
});

/* ---------- Responsável: aparece de 12 a 15 anos ---------- */
function atualizarResponsavel() {
  const v = form.nascimento.value;
  const idade = v ? idadeEmAnos(v) : NaN;
  const precisa = idade >= 12 && idade < 16;
  if (blocoResp.hidden === precisa) {
    blocoResp.hidden = !precisa;
    blocoResp.querySelectorAll(".campo").forEach(c => {
      c.classList.remove("invalido", "valido");
      c.querySelector(".erro").textContent = "";
      c.querySelector("input").removeAttribute("aria-invalid");
    });
    if (!precisa) {
      form.responsavel.value = "";
      form.autorizacao.checked = false;
    }
  }
}
form.nascimento.addEventListener("input", atualizarResponsavel);
form.nascimento.addEventListener("change", atualizarResponsavel);

/* ---------- Limpar formulário ---------- */
form.addEventListener("reset", () => setTimeout(() => {
  limparEstado();
  atualizarResponsavel();
}, 0));

/* ---------- Envio ---------- */
const enviar = form.querySelector('button[type="submit"]');
const limpar = form.querySelector('button[type="reset"]');

form.addEventListener("submit", async evento => {
  evento.preventDefault();
  if (enviar.disabled) return;

  mensagem.className = "mensagem";
  mensagem.textContent = "";
  atualizarResponsavel();
  const resultados = Object.keys(validadores).map(nome => [nome, validarCampo(nome)]);
  const primeiroInvalido = resultados.find(([, ok]) => !ok);
  if (primeiroInvalido) {
    form[primeiroInvalido[0]].focus();
    return;
  }

  const email = Usuarios.normalizarEmail(form.email.value);
  const nome = form.nome.value.trim();
  const senha = form.senha.value;
  enviar.disabled = true;
  limpar.disabled = true;

  try {
    const credencial = await Senha.criar(senha);
    const salvo = await Usuarios.atualizar(usuarios => {
      if (usuarios.some(usuario => Usuarios.normalizarEmail(usuario.email) === email)) return false;
      usuarios.push({ nome, email, dataCadastro: new Date().toISOString(), credencial });
      return true;
    });
    if (!salvo) {
      mensagem.className = "mensagem falha";
      mensagem.textContent = "Este e-mail já está cadastrado. Tente entrar ou use outro e-mail.";
      form.email.focus();
      return;
    }
  } catch {
    mensagem.className = "mensagem falha";
    mensagem.textContent = "Não foi possível salvar a conta. Abra o projeto em HTTPS ou em localhost com o armazenamento ativado.";
    return;
  } finally {
    enviar.disabled = false;
    limpar.disabled = false;
  }

  try {
    Usuarios.passarEmailCadastro(email);
  } catch {
    // O login aceita que o e-mail seja preenchido manualmente.
  }
  window.location.assign("login.html");
});
