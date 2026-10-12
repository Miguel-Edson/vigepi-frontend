# 🧠 Módulos (Domain-Driven Design)

Esta pasta é o coração do sistema. Aqui utilizamos o conceito de separação por domínios (Contextos Delimitados). Cada módulo é independente e encapsula suas próprias regras.

### Como organizar um Módulo:
Cada pasta de domínio (ex: `patients`, `records`, `auth`, `admin`) deve conter:
* `/components`: Componentes visuais e formulários exclusivos daquele domínio. Os testes (`.spec.tsx`) devem estar colocalizados aqui.
* `/hooks`: Regras de estado global, chamadas a APIs e lógicas React exclusivas (ex: `usePatients.ts`).
* `/services`: Funções de comunicação com a API REST (Axios/Fetch).
* `/schemas`: Validações de entrada de dados utilizando Zod.
* `/types`: Interfaces do TypeScript, Enums e Tipagens (DTOs).

### ⚠️ Regra de Ouro:
Um módulo **não deve** depender fortemente do funcionamento interno de outro. Se um componente de paciente precisar de dados de fichas, ele deve importar os serviços/hooks publicamente expostos do módulo de `records`.