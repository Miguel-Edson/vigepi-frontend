# 🛠️ Utils (Funções Utilitárias)

Esta pasta guarda pequenas funções auxiliares (helpers) que realizam tarefas específicas e repetitivas. Elas são independentes e não dependem do estado do React.

## O que colocar aqui?
- Máscaras e formatações de strings (ex: `formatCPF.ts`, `formatTelefone.ts`).
- Funções para manipulação e formatação de datas (ex: `formatDate.ts`).
- Cálculos matemáticos simples que se repetem no sistema.

## Regras da Pasta
- Devem ser funções puras: para a mesma entrada, sempre retornam a mesma saída.
- Não devem conter lógica de regras de negócio pesadas, apenas manipulações auxiliares.