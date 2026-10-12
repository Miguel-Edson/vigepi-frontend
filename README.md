# SIMOS - Frontend

Sistema de Monitoramento de Sífilis (Gestacional, Congênita e Adquirida), desenvolvido para a vigilância epidemiológica e controle em Unidades de Saúde (CSFs).

## 🚀 Tecnologias Utilizadas
* **Framework:** Next.js (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Formulários e Validação:** React Hook Form + Zod
* **Arquitetura:** Modular / Domain-Driven Design (DDD) adaptado

## 🏗️ Padrões de Arquitetura e Nomenclatura
Para manter a escalabilidade do sistema, adotamos regras estritas de nomenclatura:
1. **Rotas (URLs):** A pasta `src/app/` utiliza **Português** (ex: `/pacientes`, `/fichas`), pois reflete a URL final que o usuário acessa.
2. **Código e Arquitetura:** Todo o restante (`modules`, `components`, variáveis, interfaces, hooks) utiliza **Inglês**.
3. **Componentes React:** Utilizam o padrão *PascalCase* (ex: `ModalNewPatient.tsx`).

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório**
   \`\`\`bash
   git clone <url-do-repositorio>
   \`\`\`

2. **Instale as dependências**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configuração de Variáveis de Ambiente**
   Crie um arquivo `.env.local` na raiz do projeto e adicione a URL da sua API:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3333 # Ou a porta onde seu backend está rodando
   \`\`\`

4. **Inicie o servidor de desenvolvimento**
   \`\`\`bash
   npm run dev
   \`\`\`
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.