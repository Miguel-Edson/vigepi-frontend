export interface RecordAPI {
  id: string;
  tipoNotificacao: string;
  agravo: string;
  numSinan: string;
  status: string;
  codeCid: string;
  dataNotificacao: string;
  UF: string;
  municipio: string;
  codeIbge: string;
  codeUnidadeSaude: string;
  dataDiagnostico: string;
  createdAt?: string; 
  updatedAt?: string;

  // Atualizado: O backend manda o objeto paciente inteiro
  patient: {
    id: string;
    nome: string;
    cpf: string;
    // ... você pode adicionar o resto se precisar ler algo do paciente a partir da ficha
  };

  user?: any;
  lastModifiedBy?: any;
  detalhesAdquirida?: any; 
  detalhesGestante?: any;
  detalhesCongenita?: any;
}