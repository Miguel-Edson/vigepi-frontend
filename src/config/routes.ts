// src/config/routes.ts

export const APP_ROUTES = {
  public: {
    login: '/login',
  },
  private: {
    home: '/',
    dashboard: '/dashboard',
    admin: {
      usuarios: '/admin/usuarios',
      unidades: '/admin/unidades',
    },
    pacientes: {
      list: '/pacientes',
      detalhes: (id: string) => `/pacientes/${id}`,
      fichaAdquirida: (id: string) => `/pacientes/${id}/fichas/ficha-adquirida`,
      fichaGestante: (id: string) => `/pacientes/${id}/fichas/ficha-gestacional`,
      fichaCongenita: (id: string) => `/pacientes/${id}/fichas/ficha-congenita`,
    }
  }
};

export const publicPaths = Object.values(APP_ROUTES.public);