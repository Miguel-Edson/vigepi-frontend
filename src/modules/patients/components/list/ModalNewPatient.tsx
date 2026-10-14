"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { RadioField } from "@/components/form/RadioField";
import { Raca, Escolaridade, Sexo, Gestante, ZonaResidencia } from "@/modules/patients/types/patient";
import { novaFichaSchema, type NovaFichaForm } from "@/modules/patients/schemas/patientSchema";


interface ModalNewPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: Partial<NovaFichaForm> | null; 
  onSaveAction?: (data: NovaFichaForm) => void; 
}

export function ModalNewPatient({ isOpen, onClose, patientData, onSaveAction }: ModalNewPatientProps) {
  
const handleAutoFill = () => {
    reset({
      nome: "Paciente de Teste Automático",
      dataNascimento: "1995-08-20",
      cns: "700000000000090", // 15 dígitos
      sexo: Sexo.MASCULINO,
      gestante: Gestante.NAO,
      raca: Raca.PARDA,
      cpf: "953.328.140-54",
      nomeDaMae: "Maria da Silva Teste",
      escolaridade: Escolaridade.MEDIO_COMPLETO,
      
      uf: "CE",
      municipio: "Sobral",
      distrito: "Sede",
      bairro: "Centro",
      logradouro: "Rua Viriato de Medeiros",
      codigo: "1234",
      numero: "1250",
      complemento: "Casa",
      pontoDeReferencia: "Próximo ao Arco",
      cep: "62011065",
      telefone: "88999999999",
      zona: ZonaResidencia.URBANA,
      pais: "Brasil"
    });
  };
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<NovaFichaForm>({
    resolver: zodResolver(novaFichaSchema),
  });

  // Variável que diz ao componente se estamos a criar ou a editar
  const isEditing = !!patientData;

  // O "Cérebro" da Edição: Quando o modal abre, preenche ou limpa os campos
useEffect(() => {
    if (isOpen) {
      if (patientData) {
        // Tratamos os dados antes de os injetar no formulário
        reset({
          ...patientData,
          
          // 1. Resolve o "Invalid input": Força a idade a ser string para agradar ao Zod
          idade: patientData.idade ? String(patientData.idade) : "",
          
          // 2. Resolve o Select vazio: Se não vier unidadeIdade da API, assume "anos"
          unidadeIdade: patientData.unidadeIdade || "anos",
          
          // (Bónus) Prevenção: Garante que a data vem no formato YYYY-MM-DD para o HTML não quebrar
          dataNascimento: patientData.dataNascimento 
            ? patientData.dataNascimento.split('T')[0] 
            : "",
        });
      } else {
        // Se for criar um novo paciente, limpa tudo mas já deixa "anos" pré-selecionado
        reset({
          unidadeIdade: "anos"
        });
      }
    }
  }, [isOpen, patientData, reset]);

  const sexoOptions = Object.values(Sexo).map(val => ({ label: val, value: val }));
  const gestanteOptions = Object.values(Gestante).map(val => ({ label: val, value: val }));
  const racaOptions = Object.values(Raca).map(val => ({ label: val, value: val }));
  const escolaridadeOptions = Object.values(Escolaridade).map(val => ({ label: val, value: val }));
  const zonaOptions = Object.values(ZonaResidencia).map(val => ({ label: val, value: val }));

const onSubmit = (data: NovaFichaForm) => {
    if (onSaveAction) {
      onSaveAction(data);
    } else {
      console.log(isEditing ? "Atualizando paciente:" : "Novo paciente criado:", data);
    }
    reset();
    onClose();
  };

  // NOVA FUNÇÃO: Vai apanhar os erros silenciosos do Zod
  const onError = (erros: any) => {
    console.error("O Zod bloqueou o envio! Campos com erro:", erros);
    alert("Verifique os campos obrigatórios. Alguns dados estão inválidos.");
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Cabeçalho Dinâmico */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Editar Dados do Paciente" : "Nova Ficha de Notificação"}
          </h2>
          <button type="button" onClick={() => { reset(); onClose(); }} className="text-gray-400 hover:text-red-500 text-2xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-10">
          
          {/* --- SEÇÃO 1: NOTIFICAÇÃO INDIVIDUAL --- */}
          <div className="border border-primary rounded-xl p-5 relative">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium">Notificação Individual</h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              {/* Linha 1 */}
              <InputField label="Nome do paciente *" placeholder="Inserir nome..." register={register("nome")} error={errors.nome?.message} className="col-span-12 md:col-span-6" />
              <InputField type="date" label="Data de Nascimento *" register={register("dataNascimento")} error={errors.dataNascimento?.message} className="col-span-12 md:col-span-3" />
              <InputField label="Cartão do SUS *" placeholder="xxx.xxx.xxx - xx" register={register("cns")} error={errors.cns?.message} className="col-span-12 md:col-span-3" />
              
              {/* Linha 2 (Sem a idade, redistribuímos as 12 colunas) */}
              <RadioField label="Sexo *" register={register("sexo")} error={errors.sexo?.message} options={sexoOptions} className="col-span-12 md:col-span-4" />
              <SelectField label="Gestante" name="gestante" control={control} options={gestanteOptions} placeholder="Selecione..." className="col-span-12 md:col-span-2" />
              <SelectField label="Raça / Cor" name="raca" control={control} options={racaOptions} placeholder="Selecione..." className="col-span-12 md:col-span-2" />
              <InputField label="CPF *" placeholder="xxx.xxx.xxx - xx" register={register("cpf")} error={errors.cpf?.message} className="col-span-12 md:col-span-4" />
              
              {/* Linha 3 */}
              <InputField label="Nome da mãe *" placeholder="Inserir nome..." register={register("nomeDaMae")} error={errors.nomeDaMae?.message} className="col-span-12 md:col-span-6" />
              <SelectField label="Escolaridade *" name="escolaridade" control={control} error={errors.escolaridade?.message} options={escolaridadeOptions} placeholder="Selecione..." className="col-span-12 md:col-span-6" />
            </div>
          </div>

          {/* --- SEÇÃO 2: DADOS DE RESIDÊNCIA --- */}
          <div className="border border-primary rounded-xl p-5 relative">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium">Dados de Residência</h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              <InputField label="UF *" placeholder="XX" register={register("uf")} error={errors.uf?.message} className="col-span-12 md:col-span-1" />
              <InputField label="Município de Residência *" placeholder="Inserir ..." register={register("municipio")} error={errors.municipio?.message} className="col-span-12 md:col-span-4" />
              <InputField label="Código (IBGE) *" placeholder="xxxxxxxxxx" register={register("ibge")} disabled className="col-span-12 md:col-span-3" />
              <InputField label="Distrito *" placeholder="Inserir Distrito" register={register("distrito")} error={errors.distrito?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Bairro *" placeholder="Inserir Bairro" register={register("bairro")} error={errors.bairro?.message} className="col-span-12 md:col-span-2" />
              
              <InputField label="Logradouro (rua, avenida,...) *" placeholder="Inserir ..." register={register("logradouro")} error={errors.logradouro?.message} className="col-span-12 md:col-span-6" />
              <InputField label="Código *" placeholder="xxxxxxxxxx" register={register("codigo")} error={errors.codigo?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Número *" placeholder="xxxxxx" register={register("numero")} error={errors.numero?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Complemento *" placeholder="xxx.xxx.xxx - xx" register={register("complemento")} error={errors.complemento?.message} className="col-span-12 md:col-span-2" />

              <InputField label="Ponto de Referência *" placeholder="xxxxxx" register={register("pontoDeReferencia")} error={errors.pontoDeReferencia?.message} className="col-span-12 md:col-span-4" />
              <InputField label="CEP *" placeholder="xxx.xxx.xxx - xx" register={register("cep")} error={errors.cep?.message} className="col-span-12 md:col-span-2" />
              <InputField label="(DDD) Telefone *" placeholder="xxx.xxx.xxx - xx" register={register("telefone")} error={errors.telefone?.message} className="col-span-12 md:col-span-2" />

              <SelectField label="Zona *" name="zona" control={control} error={errors.zona?.message} options={zonaOptions} placeholder="Selecione..." className="col-span-12 md:col-span-4" />
              <InputField label="País (se residente fora do Brasil) *" placeholder="Inserir nome ..." register={register("pais")} error={errors.pais?.message} className="col-span-12 md:col-span-12" />
            </div>
          </div>

        </div>

        {/* Rodapé Dinâmico */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl sticky bottom-0 z-10">
          
          {/* Lado Esquerdo: Botão Mágico (Só aparece na criação) */}
          <div>
            {!isEditing && (
              <button 
                type="button" 
                onClick={handleAutoFill} 
                className="px-4 py-2 border border-dashed border-purple-400 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors cursor-pointer text-sm font-semibold flex items-center gap-2"
                title="Preencher com dados de teste"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>
                </svg>
                Auto-Preencher (Dev)
              </button>
            )}
          </div>

          {/* Lado Direito: Botões Padrão */}
          <div className="flex gap-3">
            <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary transition-colors cursor-pointer font-medium">
              {isEditing ? "Salvar Alterações" : "Salvar e Continuar"}
            </button>
          </div>
          
        </div>

      </form>
    </div>
  );
}