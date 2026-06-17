"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { usuario } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-[family-name:var(--font-lora)] text-8xl font-semibold leading-none text-malta">
          Krausen
        </h1>
        <p className="mt-4 font-[family-name:var(--font-lora)] text-3xl leading-snug text-ambar-oscuro">
          Recetas de cerveza artesanal, de quienes las elaboran
        </p>
        <p className="mx-auto mt-8 max-w-lg text-xl leading-relaxed text-tostado">
          Descubre recetas de la comunidad, haz tu propia versión y comparte tus elaboraciones con cerveceros de todo el mundo.
        </p>
        {!usuario && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link
              href="/registro"
              className="rounded-md bg-ambar px-8 py-3.5 text-lg font-medium text-white transition-colors hover:bg-ambar-oscuro"
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-tostado/30 px-8 py-3.5 text-lg font-medium text-tostado transition-colors hover:border-tostado hover:text-malta"
            >
              Entrar
            </Link>
          </div>
        )}
        {usuario && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link
              href="/recetas"
              className="rounded-md bg-ambar px-8 py-3.5 text-lg font-medium text-white transition-colors hover:bg-ambar-oscuro"
            >
              Explorar recetas
            </Link>
            <Link
              href="/cervezas/nueva"
              className="rounded-md border border-tostado/30 px-8 py-3.5 text-lg font-medium text-tostado transition-colors hover:border-tostado hover:text-malta"
            >
              Crear receta
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}