"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { RadioField } from "@/components/form/RadioField";
import { patientService } from "@/services/patientService";
import { novaFichaSchema, NovaFichaForm } from "@/schemas/patientSchema";

// Você pode colocar isso em um utils.ts depois, ou manter aqui por enquanto
const MOCK_PATIENT_DATA: NovaFichaForm = {
  nome: "Sicrano da Silva Sauro",
  dataNascimento: "1995-08-15",
  cns: "898210000000011",
  idade: "31",
  unidadeIdade: "anos",
  sexo: "Masculino",
  gestante: "Não",
  raca: "Branca",
  cpf: "427.620.320-16",
  nomeDaMae: "Fernanda Silva",
  escolaridade: "Médio Completo",
  uf: "CE",
  municipio: "Sobral",
  ibge: "2312908",
  distrito: "Sede",
  bairro: "Centro",
  logradouro: "Rua Viriato de Medeiros",
  codigo: "54321",
  numero: "1234",
  complemento: "Casa",
  geoCampo1: "-3.6895",
  geoCampo2: "-40.3481",
  pontoDeReferencia: "Próximo à Prefeitura",
  cep: "62011-060",
  telefone: "88988887777",
  cpfResidencia: "88877766655",
  zona: "Urbana",
  pais: "Brasil"
};

interface ModalNewPatientProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModalNewPatient({ isOpen, onClose, onSuccess }: ModalNewPatientProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<NovaFichaForm>({
    resolver: zodResolver(novaFichaSchema),
    defaultValues: {
      unidadeIdade: "anos",
      gestante: "Não",
      raca: "",
      escolaridade: "",
      zona: ""
    }
  });

  const onSubmit = async (data: NovaFichaForm) => {
    try {
      const payload = {
        nome: data.nome,
        cpf: data.cpf.replace(/\D/g, ''),
        dataNascimento: data.dataNascimento,
        sexo: data.sexo,
        gestante: data.gestante || "Não",
        raca: data.raca || "Ignorado",
        escolaridade: data.escolaridade,
        cns: data.cns,
        nomeDaMae: data.nomeDaMae,
        uf: data.uf,
        municipio: data.municipio,
        distrito: data.distrito,
        bairro: data.bairro,
        logradouro: data.logradouro,
        codigo: data.codigo,
        numero: data.numero,
        complemento: data.complemento,
        pontoDeReferencia: data.pontoDeReferencia,
        cep: data.cep,
        telefone: data.telefone,
        zona: data.zona,
        pais: data.pais
      };

      await patientService.create(payload);
      
      alert("Paciente cadastrado com sucesso!");
      reset();
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Erro ao salvar o paciente. Verifique os dados e tente novamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Nova Ficha de Notificação</h2>
            {process.env.NODE_ENV === "development" && (
              <button 
                type="button" 
                onClick={() => reset(MOCK_PATIENT_DATA)}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold hover:bg-purple-200 transition-colors"
              >
                🐛 Auto-Preencher (Dev)
              </button>
            )}
          </div>
          <button type="button" onClick={() => { reset(); onClose(); }} className="text-gray-400 hover:text-red-500 text-2xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-10">
          
          {/* --- SEÇÃO 1: NOTIFICAÇÃO INDIVIDUAL --- */}
          <div className="border border-primary rounded-xl p-5 relative">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium">Notificação Individual</h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              <InputField label="Nome do paciente *" placeholder="Inserir nome..." register={register("nome")} error={errors.nome?.message} className="col-span-12 md:col-span-6" />
              <InputField label="Data de Nascimento *" placeholder="DD/MM/AAAA" register={register("dataNascimento")} error={errors.dataNascimento?.message} className="col-span-12 md:col-span-3" />
              <InputField label="Cartão do SUS *" placeholder="xxx.xxx.xxx - xx" register={register("cns")} error={errors.cns?.message} className="col-span-12 md:col-span-3" />
              
              <div className="col-span-12 md:col-span-2 flex gap-2">
                 <InputField label="Idade *" placeholder="xx" register={register("idade")} error={errors.idade?.message} className="flex-1" />
                <SelectField 
                  label="&nbsp;" 
                  options={[{label: 'Anos', value: 'anos'}, {label: 'Meses', value: 'meses'}, {label: 'Seamanas', value: 'semanas'}]} 
                  className="w-24"
                  value={watch("unidadeIdade")}
                  onChange={(val) => setValue("unidadeIdade", val, { shouldValidate: true })}
                />              
              </div>
              <RadioField label="Sexo *" register={register("sexo")} error={errors.sexo?.message} options={[{label: 'Masculino', value: 'Masculino'}, {label: 'Feminino', value: 'Feminino'}, {label: 'Ignorado', value: 'Ignorado'}]} className="col-span-12 md:col-span-3" />
              <SelectField 
                label="Gestante" 
                options={[{label: 'Não se aplica', value: 'Não'}, {label: '1º Trimestre', value: '1'}]} 
                className="col-span-12 md:col-span-2"
                value={watch("gestante") || ""}
                onChange={(val) => setValue("gestante", val, { shouldValidate: true })}
              />              
              <SelectField 
                label="Raça / Cor" 
                options={[{label: 'Parda', value: 'Parda'}, {label: 'Branca', value: 'Branca'}, {label: 'Preta', value: 'Preta'}]} 
                className="col-span-12 md:col-span-2"
                value={watch("raca") || ""}
                onChange={(val) => setValue("raca", val, { shouldValidate: true })}
              />              
              <InputField label="CPF *" placeholder="xxx.xxx.xxx - xx" register={register("cpf")} error={errors.cpf?.message} className="col-span-12 md:col-span-3" />
              <InputField label="Nome da mãe *" placeholder="Inserir nome..." register={register("nomeDaMae")} error={errors.nomeDaMae?.message} className="col-span-12 md:col-span-6" />
              <SelectField 
                label="Escolaridade *" 
                error={errors.escolaridade?.message} 
                options={[{label: 'Médio Completo', value: 'Médio Completo'}, {label: 'Superior', value: 'Superior'}]} 
                className="col-span-12 md:col-span-6"
                value={watch("escolaridade") || ""}
                onChange={(val) => setValue("escolaridade", val, { shouldValidate: true })}
              />            
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
              
              <InputField label="Logradouro (rua, avenida,...) *" placeholder="Inserir ..." register={register("logradouro")} error={errors.logradouro?.message} className="col-span-12 md:col-span-4" />
              <InputField label="Código *" placeholder="xxxxxxxxxx" register={register("codigo")} error={errors.codigo?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Número *" placeholder="xxxxxx" register={register("numero")} error={errors.numero?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Complemento (apto., casa...) *" placeholder="xxx.xxx.xxx - xx" register={register("complemento")} error={errors.complemento?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Geo Campo 1 *" placeholder="xxx.xxx.xxx - xx" register={register("geoCampo1")} error={errors.geoCampo1?.message} className="col-span-12 md:col-span-2" />

              <InputField label="Geo Campo 2 *" placeholder="xxx.xxx.xxx - xx" register={register("geoCampo2")} error={errors.geoCampo2?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Ponto de Referência *" placeholder="xxxxxx" register={register("pontoDeReferencia")} error={errors.pontoDeReferencia?.message} className="col-span-12 md:col-span-3" />
              <InputField label="CEP *" placeholder="xxx.xxx.xxx - xx" register={register("cep")} error={errors.cep?.message} className="col-span-12 md:col-span-2" />
              <InputField label="(DDD) Telefone *" placeholder="xxx.xxx.xxx - xx" register={register("telefone")} error={errors.telefone?.message} className="col-span-12 md:col-span-2" />
              <InputField label="CPF *" placeholder="xxx.xxx.xxx - xx" register={register("cpfResidencia")} error={errors.cpfResidencia?.message} className="col-span-12 md:col-span-3" />

              <SelectField 
                label="Zona *" 
                error={errors.zona?.message} 
                options={[{label: 'Urbana', value: 'Urbana'}, {label: 'Rural', value: 'Rural'}]} 
                className="col-span-12 md:col-span-4"
                value={watch("zona") || ""}
                onChange={(val) => setValue("zona", val, { shouldValidate: true })}
              />              
              <InputField label="País (se residente fora do Brasil) *" placeholder="Inserir nome ..." register={register("pais")} error={errors.pais?.message} className="col-span-12 md:col-span-8" />
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl sticky bottom-0 z-10">
          <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary transition-colors cursor-pointer font-medium">
            Salvar e Continuar
          </button>
        </div>

      </form>
    </div>
  );
}