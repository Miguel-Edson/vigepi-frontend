# 📍 App Router (Rotas da Aplicação)

Esta pasta é **exclusiva para roteamento**. Aqui dentro vivem apenas arquivos nativos do Next.js App Router (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).

### ⚠️ Regras desta pasta:
1. **Nomenclatura:** As subpastas devem ser nomeadas em **Português**, pois elas definem as URLs do sistema (ex: `/pacientes/fichas`).
2. **Sem Regra de Negócio:** Não crie lógicas complexas, chamadas de API diretas ou validações aqui.
3. **Co-localização:** Componentes visuais não devem morar aqui. Os arquivos `page.tsx` devem apenas importar e renderizar os componentes/containers que vêm de `src/modules/...` ou `src/components/...`.