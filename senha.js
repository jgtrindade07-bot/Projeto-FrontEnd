const Senha = (() => {
  const iteracoes = 600000;

  async function calcular(senha, salHex) {
    const sal = Uint8Array.from(salHex.match(/../g), byte => parseInt(byte, 16));
    const chave = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: iteracoes }, chave, 256
    );
    return hex(new Uint8Array(bits));
  }

  function hex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  }

  async function criar(senha) {
    const sal = hex(crypto.getRandomValues(new Uint8Array(16)));
    return { sal, hash: await calcular(senha, sal) };
  }

  async function confere(usuario, senha) {
    if (!usuario?.credencial) return usuario?.senha === senha;
    const { sal, hash } = usuario.credencial;
    if (!/^[0-9a-f]{32}$/.test(sal) || !/^[0-9a-f]{64}$/.test(hash)) return false;
    return (await calcular(senha, sal)) === hash;
  }

  return { criar, confere };
})();
