import { apiFetch } from '@/lib/api';
import { PatientAPI, CreatePatientDTO, UpdatePatientDTO } from '@/types/patient';

export const patientService = {
  
  // 1. POST: Cadastrar paciente
  async create(data: CreatePatientDTO): Promise<PatientAPI> {
    return apiFetch<PatientAPI>('/patients/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2. GET: Listar pacientes (O que já usamos na tabela)
  async getAllPatients(): Promise<PatientAPI[]> {
    return apiFetch<PatientAPI[]>('/patients/all', {
      method: 'GET',
    });
  },

  // 3. GET: Buscar paciente por CPF
  async getByCpf(cpf: string): Promise<PatientAPI> {
    // É uma boa prática remover a pontuação do CPF antes de mandar para a URL
    const cleanCpf = cpf.replace(/\D/g, ''); 
    return apiFetch<PatientAPI>(`/patients/cpf/${cleanCpf}`, {
      method: 'GET',
    });
  },

  // 4. GET: Buscar paciente por CNS
  async getByCns(cns: string): Promise<PatientAPI> {
    const cleanCns = cns.replace(/\D/g, '');
    return apiFetch<PatientAPI>(`/patients/cns/${cleanCns}`, {
      method: 'GET',
    });
  },

  // 5. GET: Buscar paciente por ID
  async getById(id: string): Promise<PatientAPI> {
    return apiFetch<PatientAPI>(`/patients/${id}`, {
      method: 'GET',
    });
  },

  // 6. PATCH: Atualizar paciente
  async update(id: string, data: UpdatePatientDTO): Promise<PatientAPI> {
    return apiFetch<PatientAPI>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
};