"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ArbolForks from "@/components/ArbolForks";

export default function ArbolPage() {
  const { id } = useParams();
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/api/cervezas/${id}`)
        .then((res) => setNombre(res.data.nombre))
        .catch(() => {});
    }
  }, [id]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href={`/cervezas/${id}`} className="inline-flex items-center gap-1.5 text-sm text-tostado transition-colors hover:text-malta">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver a la receta
      </Link>

      <h1 className="mt-6 font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta sm:text-4xl">
        Árbol de versiones
      </h1>
      {nombre && <p className="mt-2 text-tostado">{nombre}</p>}

      <div className="mt-10 rounded-lg border border-linea bg-espuma p-8">
        <ArbolForks cervezaId={id as string} />
      </div>
    </main>
  );
}