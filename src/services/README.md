# 🔌 Services (Integração com API)

Esta pasta centraliza todas as funções que se comunicam com o mundo externo, especificamente com o back-end do VIGEPI.

## O que colocar aqui?
- Funções de fetch/axios separadas por entidade.
  - *Exemplos:* `pacientesService.ts`, `authService.ts`, `fichasService.ts`.

## Regras da Pasta
- Nenhuma lógica visual (React) deve existir aqui.
- As funções devem apenas receber os dados, fazer a requisição HTTP (GET, POST, PUT, DELETE) e retornar a resposta formatada para quem a chamou.