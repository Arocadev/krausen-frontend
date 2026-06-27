"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { usuario } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-[family-name:var(--font-lora)] text-6xl font-semibold leading-none text-malta sm:text-8xl">
          Krausen
        </h1>
        <p className="mt-4 font-[family-name:var(--font-lora)] text-xl leading-snug text-ambar-oscuro sm:text-3xl">
          Recetas de cerveza artesanal, de quienes las elaboran
        </p>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-tostado sm:mt-8 sm:text-xl">
          Descubre recetas de la comunidad, haz tu propia versión y comparte tus elaboraciones con cerveceros de todo el mundo.
        </p>

        {!usuario && (
          <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/registro"
              className="w-full rounded-md bg-ambar px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-ambar-oscuro sm:w-auto sm:text-lg"
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="w-full rounded-md border border-tostado/30 px-8 py-3.5 text-base font-medium text-tostado transition-colors hover:border-tostado hover:text-malta sm:w-auto sm:text-lg"
            >
              Entrar
            </Link>
          </div>
        )}

        {usuario && (
          <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/recetas"
              className="w-full rounded-md bg-ambar px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-ambar-oscuro sm:w-auto sm:text-lg"
            >
              Explorar recetas
            </Link>
            <Link
              href="/cervezas/nueva"
              className="w-full rounded-md border border-tostado/30 px-8 py-3.5 text-base font-medium text-tostado transition-colors hover:border-tostado hover:text-malta sm:w-auto sm:text-lg"
            >
              Crear receta
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}