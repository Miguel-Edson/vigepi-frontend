export const normalizeCPF = (value: string | undefined) => {
  if (!value) return "";
  
  return value
    .replace(/[\D]/g, "")                   // Remove tudo o que não é número
    .replace(/(\d{3})(\d)/, "$1.$2")        // Adiciona o primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2")        // Adiciona o segundo ponto
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")   // Adiciona o traço
    .replace(/(-\d{2})\d+?$/, "$1");        // Impede que o usuário digite mais do que o necessário
};

// "2026-10-14" ou "2026-10-14T00:00:00.000Z" -> "14/10/2026".
// Lê o texto direto, sem passar por new Date(), para o fuso horário não mudar o dia.
export const formatDate = (value?: string | null) => {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
};

// Valor aceito por <input type="date"> (exige AAAA-MM-DD)
export const toDateInput = (value?: string | null) => (value ? value.split("T")[0] : "");

const pad2 = (n: number) => String(n).padStart(2, "0");

// Data e hora no padrão brasileiro: "dd/MM/aaaa HH:mm", no horário local do navegador.
// Serve para carimbos de tempo da API ("2026-11-14T15:30:00.000Z"). Se vier só a data
// ("2026-11-14"), mostra só "14/11/2026" (sem converter fuso, para o dia não mudar).
export const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return formatDate(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};