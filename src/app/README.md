# 📂 App (Rotas do Next.js)

Esta pasta utiliza o **App Router** do Next.js. Toda a estrutura de roteamento do sistema VIGEPI é definida aqui.

## Regras da Pasta
- **Apenas rotas:** Cada pasta aqui representa uma rota na URL, desde que possua um arquivo `page.tsx`.
- **Rotas Privadas/Grupos:** Pastas com parênteses, como `(auth)`, são usadas apenas para agrupar arquivos logicamente e não afetam a URL final.
- **Rotas Dinâmicas:** Pastas com colchetes, como `[id]`, indicam rotas dinâmicas (ex: acessar o perfil de um paciente específico usando `/pacientes/123`).

## Estrutura Atual
- `(auth)`: Telas de login e cadastro.
- `pacientes`: Tabela principal com a lista de pacientes.
- `pacientes/[id]`: Tela de detalhes de um paciente específico.
- `pacientes/[id]/fichas/...`: Telas isoladas para cada tipo de ficha de notificação de sífilis (Adquirida, Congênita, Gestante).