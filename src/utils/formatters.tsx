export const normalizeCPF = (value: string | undefined) => {
  if (!value) return "";
  
  return value
    .replace(/[\D]/g, "")                   // Remove tudo o que não é número
    .replace(/(\d{3})(\d)/, "$1.$2")        // Adiciona o primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2")        // Adiciona o segundo ponto
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")   // Adiciona o traço
    .replace(/(-\d{2})\d+?$/, "$1");        // Impede que o usuário digite mais do que o necessário
};