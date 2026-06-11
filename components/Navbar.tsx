"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-linea bg-crema/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-lora)] text-2xl font-semibold tracking-tight text-malta"
        >
          Krausen
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-tostado sm:flex">
          <Link href="/recetas" className="transition-colors hover:text-ambar-oscuro">
            Recetas
          </Link>
          <Link href="/ranking" className="transition-colors hover:text-ambar-oscuro">
            Ranking
          </Link>
          {usuario && (
            <Link href="/mis-recetas" className="transition-colors hover:text-ambar-oscuro">
              Mis recetas
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {usuario ? (
            <>
              <Link
                href="/perfil"
                className="text-sm font-medium text-tostado transition-colors hover:text-malta"
              >
                Mi perfil
              </Link>
              <div className="h-4 w-px bg-linea" />
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium text-tostado transition-colors hover:text-malta"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-tostado transition-colors hover:text-malta"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="rounded-md bg-malta px-4 py-2 text-sm font-medium text-crema transition-colors hover:bg-carbon"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}