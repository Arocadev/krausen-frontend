"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

type Nodo = {
  id: number;
  nombre: string;
  username: string | null;
  es_actual: boolean;
  hijos: Nodo[];
};

function NodoArbol({ nodo, esRaiz, tPor }: { nodo: Nodo; esRaiz: boolean; tPor: string }) {
  return (
    <div className="flex flex-col items-center">
      <Link
        href={`/cervezas/${nodo.id}`}
        className={`rounded-lg border px-5 py-3 text-center transition-all hover:shadow-md ${nodo.es_actual ? "border-ambar bg-ambar/15 shadow-sm" : "border-linea bg-white hover:border-ambar/50"}`}
        style={{ minWidth: "160px", maxWidth: "220px" }}
      >
        <p className={`font-[family-name:var(--font-lora)] text-sm font-semibold leading-tight ${nodo.es_actual ? "text-ambar-oscuro" : "text-malta"}`}>
          {nodo.nombre}
        </p>
        {nodo.username && <p className="mt-1 text-xs text-tostado">{tPor} {nodo.username}</p>}
        {esRaiz && (
          <span className="mt-1.5 inline-block rounded-full bg-ambar/25 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ambar-oscuro">
            Original
          </span>
        )}
      </Link>
      {nodo.hijos.length > 0 && (
        <>
          <div className="h-6 w-px bg-linea" />
          <div className="relative flex gap-8">
            {nodo.hijos.length > 1 && (
              <div className="absolute top-0 h-px bg-linea" style={{ left: "50%", right: "50%", marginLeft: `-${(nodo.hijos.length - 1) * 52}px`, marginRight: `-${(nodo.hijos.length - 1) * 52}px` }} />
            )}
            {nodo.hijos.map((hijo) => (
              <div key={hijo.id} className="flex flex-col items-center">
                <div className="h-6 w-px bg-linea" />
                <NodoArbol nodo={hijo} esRaiz={false} tPor={tPor} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ArbolForks({ cervezaId }: { cervezaId: string }) {
  const t = useTranslations("detalle");
  const tRecetas = useTranslations("recetas");
  const [arbol, setArbol] = useState<Nodo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get(`/api/cervezas/arbol/${cervezaId}`)
      .then((res) => setArbol(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [cervezaId]);

  if (cargando) return null;
  if (!arbol || (!arbol.hijos.length && !arbol.es_actual)) return null;
  if (!arbol.hijos.length && !arbol.es_actual) return null;
  if (!arbol.hijos.length && !arbol.es_actual) return null;

  return (
    <section className="border-t border-linea">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
          Árbol de versiones
        </h2>
        <p className="mt-2 text-sm text-tostado">
          Receta original y todas las versiones derivadas.
        </p>
        <div className="mt-8 flex justify-center overflow-x-auto py-4">
          <NodoArbol nodo={arbol} esRaiz={true} tPor={tRecetas("por")} />
        </div>
      </div>
    </section>
  );
}