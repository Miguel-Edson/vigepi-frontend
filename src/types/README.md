# 🏷️ Types (Tipagens do TypeScript)

Como utilizamos TypeScript, esta pasta serve como o dicionário central do sistema. Todas as interfaces e tipos globais devem ser definidos aqui.

## O que colocar aqui?
- Interfaces de entidades do banco de dados (ex: `Paciente.ts`, `FichaSifilis.ts`).
- Tipagens de respostas e requisições da API.
- Schemas do Zod para validação de formulários.

## Regras da Pasta
- Exporte as interfaces para que possam ser utilizadas tanto nos componentes (para tipar `props`) quanto nos serviços (para tipar retornos de API).