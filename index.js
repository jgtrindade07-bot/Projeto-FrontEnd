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

textoBoasVindas.textContent = saudacao() + "! Bem-vindo à Academia das Maravilhas. Que tal começar hoje?";
caixa.hidden = false;

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

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
});

// 4. Ano atual no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();
