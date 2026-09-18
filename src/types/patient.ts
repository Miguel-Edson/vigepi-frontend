export interface CreatePatientDTO {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  gestante: string;
  raca: string;
  escolaridade: string;
  cns: string;
  nomeDaMae: string;
  uf: string;
  municipio: string;
  distrito: string;
  bairro: string;
  logradouro: string;
  codigo: string;
  numero: string;
  complemento: string;
  pontoDeReferencia: string;
  cep: string;
  telefone: string;
  zona: string;
  pais: string;
}

export interface PatientAPI extends CreatePatientDTO {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
// O Partial faz com que o UpdatePatientDTO tenha os mesmos campos do Create, 
// mas todos eles viram opcionais (ex: nome?: string).
export type UpdatePatientDTO = Partial<CreatePatientDTO>;

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