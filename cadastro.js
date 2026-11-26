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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Digite um e-mail válido, como nome@email.com.";
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
    return form.termos.checked ? "" : "Aceite os termos para continuar.";
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
form.addEventListener("submit", e => {
  e.preventDefault();

  const resultados = Object.keys(validadores).map(n => [n, validarCampo(n)]);
  const primeiroInvalido = resultados.find(([, ok]) => !ok);
  if (primeiroInvalido) {
    form[primeiroInvalido[0]].focus();
    return;
  }

  // Armazenamento didático (localStorage). Em produção isso seria feito no servidor.
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const email = form.email.value.trim().toLowerCase();

  if (usuarios.some(u => u.email === email)) {
    mensagem.className = "mensagem falha";
    mensagem.textContent = "Este e-mail já está cadastrado. Tente entrar.";
    return;
  }

  usuarios.push({
    nome: form.nome.value.trim(),
    email,
    cpf: form.cpf.value,
    nascimento: form.nascimento.value,
    telefone: form.telefone.value,
    responsavel: form.responsavel.value.trim() || null,
    senha: form.senha.value,
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mensagem.className = "mensagem sucesso";
  mensagem.textContent = "Conta criada! Levando você para o login...";
  setTimeout(() => {
    window.location.href = "login.html?email=" + encodeURIComponent(email);
  }, 1500);
});
