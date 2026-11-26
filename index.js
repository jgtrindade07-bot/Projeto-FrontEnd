/* Interações da página principal */

// 1. Mensagem de boas-vindas conforme o horário
const caixa = document.getElementById("boas-vindas");
const textoBoasVindas = document.getElementById("boas-vindas-texto");

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

const linkEntrar = document.getElementById("menu-entrar");
const itemCadastro = document.getElementById("menu-cadastro");
const itemConta = document.getElementById("menu-conta");
const botaoSair = document.getElementById("sair");

function atualizarBoasVindas() {
  let usuario = null;
  try {
    usuario = Usuarios.usuarioDaSessao();
  } catch {
    // A página inicial também funciona sem armazenamento local.
  }

  linkEntrar.parentElement.hidden = Boolean(usuario);
  itemCadastro.hidden = Boolean(usuario);
  itemConta.hidden = !usuario;
  textoBoasVindas.textContent = usuario
    ? saudacao() + ", " + usuario.nome.trim().split(/\s+/)[0] + "!"
    : saudacao() + "! Bem-vindo à Academia das Maravilhas. Que tal começar hoje?";
}

atualizarBoasVindas();
caixa.hidden = false;

botaoSair.addEventListener("click", () => {
  Usuarios.sair();
  atualizarBoasVindas();
  caixa.hidden = false;
  linkEntrar.focus();
});

window.addEventListener("storage", evento => {
  if (evento.key === Usuarios.chave || evento.key === null) atualizarBoasVindas();
});

document.getElementById("boas-vindas-fechar").addEventListener("click", () => {
  caixa.hidden = true;
});

// 2. Botão interativo: dica do dia
const dicas = [
  "Beba água antes, durante e depois do treino.",
  "Aqueça 5 a 10 minutos antes de começar.",
  "Dormir bem é parte do treino: o músculo cresce no descanso.",
  "Consistência vale mais que intensidade: treine toda semana.",
  "Alongue ao final para ajudar na recuperação.",
];
let indiceDica = -1;

document.getElementById("botao-dica").addEventListener("click", () => {
  let novo;
  do {
    novo = Math.floor(Math.random() * dicas.length);
  } while (novo === indiceDica);
  indiceDica = novo;
  document.getElementById("dica").textContent = dicas[novo];
});

// 3. Menu responsivo (celular)
const botaoMenu = document.getElementById("menu-botao");
const menu = document.getElementById("menu");

botaoMenu.hidden = false;
const navegacao = menu.closest("nav");
navegacao.classList.add("recolhivel");

botaoMenu.addEventListener("click", () => {
  const aberto = navegacao.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
});

menu.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    navegacao.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  });
});

// 4. Ano atual no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();
