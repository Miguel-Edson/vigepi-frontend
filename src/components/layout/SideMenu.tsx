"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "@/config/navigation";
import { useIsAdmin } from "@/modules/auth/hooks/useIsAdmin";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Menu lateral (gaveta) que abre pelo botão "Menu" da barra superior e gerencia a navegação. */
export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Gerencia tecla Esc, overflow do body e foco ao abrir/fechar
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Filtra itens com base nas permissões de administrador
  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.adminOnly || isAdmin),
  })).filter((section) => section.items.length > 0);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Fundo escurecido: clicar fora fecha */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Gaveta lateral */}
      <aside
        id="side-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white text-gray-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-teal-700 px-5 py-4 text-white">
          <span className="text-base font-bold tracking-wide">Menu do Sistema</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-md p-1 text-2xl leading-none hover:bg-white/20 cursor-pointer transition-colors"
          >
            &times;
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-teal-50 text-teal-800 font-semibold border-l-4 border-teal-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}