# 🧩 Componentes Genéricos (UI)

Esta pasta é reservada para componentes de UI "burros" (Dumb Components) e elementos de layout compartilhados por toda a aplicação.

### O que DEVE morar aqui:
* **UI:** Botões, Tabelas base, Modais base, Spinners de carregamento.
* **Formulários:** Elementos de input (InputField, SelectField, RadioField).
* **Layout:** Navbar, Sidebar, Footers.

### O que NÃO deve morar aqui:
* Lógicas de negócio específicas (ex: Um formulário de criação de paciente). Tudo que for acoplado a uma regra de negócio deve ir para a pasta `src/modules/<nome-do-modulo>/components`.