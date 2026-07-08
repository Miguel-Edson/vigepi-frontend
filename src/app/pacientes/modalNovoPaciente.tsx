"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { RadioField } from "@/components/form/RadioField"; // Importamos o novo componente

// 1. Esquema de Validação com todos os campos da imagem
const novaFichaSchema = z.object({
  // Notificação Individual
  nomePaciente: z.string().min(3, "Obrigatório"),
  dataNascimento: z.string().min(10, "Obrigatório"),
  cartaoSus: z.string().min(1, "Obrigatório"),
  idade: z.string().min(1, "Obrigatório"),
  unidadeIdade: z.string().min(1, "Obrigatório"),
  sexo: z.string().min(1, "Obrigatório"),
  gestante: z.string().optional(),
  racaCor: z.string().optional(),
  cpf: z.string().min(11, "Obrigatório"),
  nomeMae: z.string().min(3, "Obrigatório"),
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
  pontoReferencia: z.string().min(1, "Obrigatório"),
  cep: z.string().min(8, "Obrigatório"),
  telefone: z.string().min(10, "Obrigatório"),
  cpfResidencia: z.string().min(11, "Obrigatório"),
  zona: z.string().min(1, "Obrigatório"),
  pais: z.string().min(1, "Obrigatório"),
});

type NovaFichaForm = z.infer<typeof novaFichaSchema>;

interface ModalNovoPacienteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalNovoPaciente({ isOpen, onClose }: ModalNovoPacienteProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NovaFichaForm>({
    resolver: zodResolver(novaFichaSchema),
  });

  const onSubmit = (data: NovaFichaForm) => {
    console.log("Ficha enviada:", data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Nova Ficha de Notificação</h2>
          <button type="button" onClick={() => { reset(); onClose(); }} className="text-gray-400 hover:text-red-500 text-2xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-10">
          
          {/* --- SEÇÃO 1: NOTIFICAÇÃO INDIVIDUAL --- */}
          <div className="border border-primary rounded-xl p-5 relative">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium">Notificação Individual</h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              {/* Linha 1 */}
              <InputField label="Nome do paciente *" placeholder="Inserir nome..." register={register("nomePaciente")} error={errors.nomePaciente?.message} className="col-span-12 md:col-span-6" />
              <InputField label="Data de Nascimento *" placeholder="xxxxxx" register={register("dataNascimento")} error={errors.dataNascimento?.message} className="col-span-12 md:col-span-3" />
              <InputField label="Cartão do SUS *" placeholder="xxx.xxx.xxx - xx" register={register("cartaoSus")} error={errors.cartaoSus?.message} className="col-span-12 md:col-span-3" />
              
              {/* Linha 2 */}
              <div className="col-span-12 md:col-span-2 flex gap-2">
                 <InputField label="Idade *" placeholder="xx" register={register("idade")} error={errors.idade?.message} className="flex-1" />
                 <SelectField label="&nbsp;" register={register("unidadeIdade")} options={[{label: 'Anos', value: 'anos'}, {label: 'Meses', value: 'meses'}]} className="w-24" />
              </div>
              <RadioField label="Sexo *" register={register("sexo")} error={errors.sexo?.message} options={[{label: 'Masculino', value: 'M'}, {label: 'Feminino', value: 'F'}, {label: 'Ignorado', value: 'I'}]} className="col-span-12 md:col-span-3" />
              <SelectField label="Gestante" register={register("gestante")} options={[{label: '6 - Não se aplica', value: '6'}]} className="col-span-12 md:col-span-2" />
              <SelectField label="Raça / Cor" register={register("racaCor")} options={[{label: 'Selecionar Raça / Cor', value: ''}]} className="col-span-12 md:col-span-2" />
              <InputField label="CPF *" placeholder="xxx.xxx.xxx - xx" register={register("cpf")} error={errors.cpf?.message} className="col-span-12 md:col-span-3" />
              
              {/* Linha 3 */}
              <InputField label="Nome da mãe *" placeholder="Inserir nome..." register={register("nomeMae")} error={errors.nomeMae?.message} className="col-span-12 md:col-span-6" />
              <SelectField label="Escolaridade *" register={register("escolaridade")} error={errors.escolaridade?.message} options={[{label: 'Selecionar Escolaridade', value: ''}]} className="col-span-12 md:col-span-6" />
            </div>
          </div>

          {/* --- SEÇÃO 2: DADOS DE RESIDÊNCIA --- */}
          <div className="border border-primary rounded-xl p-5 relative">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium">Dados de Residência</h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              {/* Linha 1 */}
              <InputField label="UF *" placeholder="XX" register={register("uf")} error={errors.uf?.message} className="col-span-12 md:col-span-1" />
              <InputField label="Município de Residência *" placeholder="Inserir ..." register={register("municipio")} error={errors.municipio?.message} className="col-span-12 md:col-span-4" />
              <InputField label="Código (IBGE) *" placeholder="xxxxxxxxxx" register={register("ibge")} disabled className="col-span-12 md:col-span-3" />
              <InputField label="Distrito *" placeholder="Inserir Distrito" register={register("distrito")} error={errors.distrito?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Bairro *" placeholder="Inserir Bairro" register={register("bairro")} error={errors.bairro?.message} className="col-span-12 md:col-span-2" />
              
              {/* Linha 2 */}
              <InputField label="Logradouro (rua, avenida,...) *" placeholder="Inserir ..." register={register("logradouro")} error={errors.logradouro?.message} className="col-span-12 md:col-span-4" />
              <InputField label="Código *" placeholder="xxxxxxxxxx" register={register("codigo")} error={errors.codigo?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Número *" placeholder="xxxxxx" register={register("numero")} error={errors.numero?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Complemento (apto., casa...) *" placeholder="xxx.xxx.xxx - xx" register={register("complemento")} error={errors.complemento?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Geo Campo 1 *" placeholder="xxx.xxx.xxx - xx" register={register("geoCampo1")} error={errors.geoCampo1?.message} className="col-span-12 md:col-span-2" />

              {/* Linha 3 */}
              <InputField label="Geo Campo 2 *" placeholder="xxx.xxx.xxx - xx" register={register("geoCampo2")} error={errors.geoCampo2?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Ponto de Referência *" placeholder="xxxxxx" register={register("pontoReferencia")} error={errors.pontoReferencia?.message} className="col-span-12 md:col-span-3" />
              <InputField label="CEP *" placeholder="xxx.xxx.xxx - xx" register={register("cep")} error={errors.cep?.message} className="col-span-12 md:col-span-2" />
              <InputField label="(DDD) Telefone *" placeholder="xxx.xxx.xxx - xx" register={register("telefone")} error={errors.telefone?.message} className="col-span-12 md:col-span-2" />
              <InputField label="CPF *" placeholder="xxx.xxx.xxx - xx" register={register("cpfResidencia")} error={errors.cpfResidencia?.message} className="col-span-12 md:col-span-3" />

              {/* Linha 4 */}
              <SelectField label="Zona *" register={register("zona")} error={errors.zona?.message} options={[{label: 'Selecionar Zona', value: ''}]} className="col-span-12 md:col-span-4" />
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