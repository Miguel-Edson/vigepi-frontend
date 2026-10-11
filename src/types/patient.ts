// Enums idênticos ao backend para garantir integridade dos dados nos Selects
export enum Sexo {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino',
  IGNORADO = 'Ignorado',
}

export enum Raca {
  BRANCA = 'Branca',
  PRETA = 'Preta',
  PARDA = 'Parda',
  AMARELA = 'Amarela',
  INDIGENA = 'Indígena',
  IGNORADO = 'Ignorado',
}

export enum Escolaridade {
  ANALFABETO = 'Analfabeto',
  FUNDAMENTAL_INCOMPLETO = 'Fundamental Incompleto',
  FUNDAMENTAL_COMPLETO = 'Fundamental Completo',
  MEDIO_INCOMPLETO = 'Médio Incompleto',
  MEDIO_COMPLETO = 'Médio Completo',
  SUPERIOR_INCOMPLETO = 'Superior Incompleto',
  SUPERIOR_COMPLETO = 'Superior Completo',
  IGNORADO = 'Ignorado',
}

export enum ZonaResidencia {
  URBANA = 'Urbana',
  RURAL = 'Rural',
  PERIURBANA = 'Periurbana',
  IGNORADO = 'Ignorado',
}

export enum Gestante {
  SIM = 'Sim',
  NAO = 'Não',
  IGNORADO = 'Ignorado',
}

// 1. O que vem do Backend (Leitura)
export interface PatientAPI {
  id: string;
  nome: string;
  dataNascimento: string;
  idade: number; // Campo virtual retornado pela API
  sexo: Sexo;
  gestante: Gestante;
  raca?: Raca;
  escolaridade?: Escolaridade;
  cns?: string;
  cpf?: string;
  nomeDaMae?: string;
  uf?: string;
  municipio?: string;
  distrito?: string;
  bairro?: string;
  logradouro?: string;
  codigo?: string;
  numero?: string;
  complemento?: string;
  pontoDeReferencia?: string;
  cep?: string;
  telefone?: string;
  zona?: ZonaResidencia;
  pais?: string;
  createdAt: string; // Datas vêm como string ISO em requisições JSON
  updatedAt: string;
}

// 2. O que enviamos para o Backend (Escrita)
export interface CreatePatientDTO {
  nome: string;
  dataNascimento: string;
  sexo: Sexo;
  gestante: Gestante;
  raca?: Raca;
  escolaridade?: Escolaridade;
  cns?: string;
  cpf?: string;
  nomeDaMae?: string;
  uf?: string;
  municipio?: string;
  distrito?: string;
  bairro?: string;
  logradouro?: string;
  codigo?: string;
  numero?: string;
  complemento?: string;
  pontoDeReferencia?: string;
  cep?: string;
  telefone?: string;
  zona?: ZonaResidencia;
  pais?: string;
}

// 3. Atualização (Transforma todos os campos do Create em opcionais)
export type UpdatePatientDTO = Partial<CreatePatientDTO>;

// 4. Exibição na Tabela (Front-end apenas)
export interface PatientTable {
  id: string;
  nome: string;
  cpf: string;
  ultimaAtt: string;
  sinam: string;
  unidade: string;
  bairro: string;
  tipoFicha: string;
  status: string;
}