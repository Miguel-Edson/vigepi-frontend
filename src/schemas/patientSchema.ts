import * as z from "zod";

export const novaFichaSchema = z.object({
  // Notificação Individual
  nome: z.string().min(3, "Obrigatório"),
  dataNascimento: z.string().min(10, "Obrigatório"),
  cns: z.string().min(1, "Obrigatório"),
  idade: z.string().min(1, "Obrigatório"),
  unidadeIdade: z.string().min(1, "Obrigatório"),
  sexo: z.string().min(1, "Obrigatório"),
  gestante: z.string().optional(),
  raca: z.string().optional(),
  cpf: z.string().min(11, "Obrigatório"),
  nomeDaMae: z.string().min(3, "Obrigatório"),
  escolaridade: z.string().min(1, "Obrigatório"),
  
  // Dados de Residência
  uf: z.string().min(2, "Obrigatório"),
  municipio: z.string().min(1, "Obrigatório"),
  ibge: z.string().optional(),
  distrito: z.string().min(1, "Obrigatório"),
  bairro: z.string().min(1, "Obrigatório"),
  logradouro: z.string().min(1, "Obrigatório"),
  codigo: z.string().min(1, "Obrigatório"),
  numero: z.string().min(1, "Obrigatório"),
  complemento: z.string().min(1, "Obrigatório"),
  geoCampo1: z.string().min(1, "Obrigatório"), 
  geoCampo2: z.string().min(1, "Obrigatório"),
  pontoDeReferencia: z.string().min(1, "Obrigatório"), 
  cep: z.string().min(8, "Obrigatório"),
  telefone: z.string().min(10, "Obrigatório"),
  cpfResidencia: z.string().min(11, "Obrigatório"), 
  zona: z.string().min(1, "Obrigatório"),
  pais: z.string().min(1, "Obrigatório"),
});

export type NovaFichaForm = z.infer<typeof novaFichaSchema>;