# 🧩 Components

Esta pasta armazena todos os componentes visuais do sistema. Para manter a organização, os componentes estão divididos em duas categorias principais.

## Subpastas
- `/ui`: Componentes "burros" e reutilizáveis. São elementos visuais isolados que não possuem lógica de negócios complexa.
  - *Exemplos:* Botões, Inputs, Modais, Cards, Tabelas.
- `/layout`: Componentes estruturais que compõem o esqueleto das páginas.
  - *Exemplos:* Sidebar (Menu Lateral), Header (Cabeçalho), Footer.

## Regras da Pasta
- Os componentes devem receber dados via `props`.
- Evite fazer chamadas à API (fetch) diretamente dentro dos componentes visuais. Deixe isso para as páginas (`page.tsx`) ou hooks.