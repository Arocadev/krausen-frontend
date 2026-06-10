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
          <Link href="/" className="transition-colors hover:text-ambar-oscuro">
            Explorar
          </Link>
          <Link href="/ranking" className="transition-colors hover:text-ambar-oscuro">
            Ranking
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <Link
                href="/cervezas/nueva"
                className="rounded-md bg-ambar px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro"
              >
                Subir cerveza
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-tostado transition-colors hover:text-malta"
              >
                Salir
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