import { APP_ROUTES } from "./routes";

// Itens do menu lateral. Para criar uma página nova no menu, acrescente uma linha aqui.

export interface NavItem {
  label: string;
  href: string;
  /** Só aparece para administradores (esconder o item não substitui a checagem no backend). */
  adminOnly?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Navegação",
    items: [
      { label: "Pacientes", href: APP_ROUTES.private.pacientes.list },
      { label: "Dashboard", href: APP_ROUTES.private.dashboard },
    ],
  },
  {
    title: "Administração",
    items: [
      { label: "Usuários", href: APP_ROUTES.private.admin.usuarios, adminOnly: true },
      { label: "Unidades de Saúde", href: APP_ROUTES.private.admin.unidades, adminOnly: true },
    ],
  },
];
