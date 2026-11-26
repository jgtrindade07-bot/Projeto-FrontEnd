const Usuarios = (() => {
  const chave = "usuarios";
  const chaveSessao = "academia:login";
  const chaveEmailCadastro = "academia:email-cadastro";

  function ler() {
    const bruto = localStorage.getItem(chave);
    if (bruto === null) return [];
    const dados = JSON.parse(bruto);
    const registros = Array.isArray(dados) ? dados : dados?.usuarios;
    if (!Array.isArray(registros)) throw new Error("Formato de usuários inválido.");
    return registros.filter(usuario =>
      typeof usuario?.nome === "string" && typeof usuario.email === "string"
    );
  }

  function atualizar(alterar) {
    function gravar() {
      const usuarios = ler();
      if (alterar(usuarios) === false) return false;
      localStorage.setItem(chave, JSON.stringify({ usuarios }));
      return true;
    }

    if (navigator.locks) return navigator.locks.request(chave, gravar);
    return Promise.resolve().then(gravar);
  }

  function normalizarEmail(email) {
    return email.trim().toLowerCase();
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function iniciarSessao(email) {
    sessionStorage.setItem(chaveSessao, email);
  }

  function sair() {
    sessionStorage.removeItem(chaveSessao);
  }

  function usuarioDaSessao() {
    const email = sessionStorage.getItem(chaveSessao);
    if (!email) return null;
    const usuario = ler().find(registro =>
      normalizarEmail(registro.email) === email && (registro.credencial || registro.senha)
    );
    if (!usuario) sair();
    return usuario || null;
  }

  function passarEmailCadastro(email) {
    sessionStorage.setItem(chaveEmailCadastro, email);
  }

  function consumirEmailCadastro() {
    const email = sessionStorage.getItem(chaveEmailCadastro);
    sessionStorage.removeItem(chaveEmailCadastro);
    return email;
  }

  return {
    chave, ler, atualizar, normalizarEmail, emailValido, iniciarSessao, sair,
    usuarioDaSessao, passarEmailCadastro, consumirEmailCadastro,
  };
})();
