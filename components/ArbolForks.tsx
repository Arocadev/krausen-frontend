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

type PosicionNodo = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const NODO_WIDTH = 190;
const NODO_HEIGHT = 70;
const GAP_X = 40;
const GAP_Y = 80;

function calcularPosiciones(
  nodo: Nodo,
  nivel: number,
  offsetX: number,
  posiciones: PosicionNodo[]
): number {
  if (nodo.hijos.length === 0) {
    posiciones.push({ id: nodo.id, x: offsetX, y: nivel * (NODO_HEIGHT + GAP_Y), width: NODO_WIDTH, height: NODO_HEIGHT });
    return offsetX + NODO_WIDTH;
  }

  let cursorX = offsetX;
  const hijos_x: number[] = [];

  for (const hijo of nodo.hijos) {
    const centroHijo = cursorX + NODO_WIDTH / 2;
    hijos_x.push(centroHijo);
    cursorX = calcularPosiciones(hijo, nivel + 1, cursorX, posiciones);
    cursorX += GAP_X;
  }
  cursorX -= GAP_X;

  const primerHijoX = hijos_x[0];
  const ultimoHijoX = hijos_x[hijos_x.length - 1];
  const centroX = (primerHijoX + ultimoHijoX) / 2 - NODO_WIDTH / 2;

  posiciones.push({ id: nodo.id, x: centroX, y: nivel * (NODO_HEIGHT + GAP_Y), width: NODO_WIDTH, height: NODO_HEIGHT });
  return cursorX;
}

function calcularLineas(
  nodo: Nodo,
  posiciones: PosicionNodo[]
): { x1: number; y1: number; x2: number; y2: number }[] {
  const lineas: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const pos = posiciones.find((p) => p.id === nodo.id);
  if (!pos) return lineas;

  for (const hijo of nodo.hijos) {
    const posHijo = posiciones.find((p) => p.id === hijo.id);
    if (posHijo) {
      lineas.push({
        x1: pos.x + NODO_WIDTH / 2,
        y1: pos.y + NODO_HEIGHT,
        x2: posHijo.x + NODO_WIDTH / 2,
        y2: posHijo.y,
      });
    }
    lineas.push(...calcularLineas(hijo, posiciones));
  }
  return lineas;
}

function aplanarNodos(nodo: Nodo): Nodo[] {
  return [nodo, ...nodo.hijos.flatMap(aplanarNodos)];
}

export default function ArbolForks({ cervezaId }: { cervezaId: string }) {
  const tRecetas = useTranslations("recetas");
  const [arbol, setArbol] = useState<Nodo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [zoom, setZoom] = useState(1);

  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 1.5;
  const ZOOM_STEP = 0.15;

  useEffect(() => {
    api.get(`/api/cervezas/arbol/${cervezaId}`)
      .then((res) => setArbol(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [cervezaId]);

  if (cargando) return null;
  if (!arbol) return null;

  const posiciones: PosicionNodo[] = [];
  const anchoTotal = calcularPosiciones(arbol, 0, 0, posiciones);
  const lineas = calcularLineas(arbol, posiciones);
  const nodos = aplanarNodos(arbol);

  const maxY = Math.max(...posiciones.map((p) => p.y + p.height));
  const svgWidth = anchoTotal;
  const svgHeight = maxY + 20;

  return (
    <div>
      {/* Controles de zoom */}
      <div className="mb-4 flex items-center gap-2 justify-end">
        <button
          onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
          disabled={zoom <= ZOOM_MIN}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-linea bg-white text-malta transition-colors hover:border-ambar hover:text-ambar disabled:opacity-30"
          title="Alejar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="min-w-[3rem] text-center text-sm text-tostado">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
          disabled={zoom >= ZOOM_MAX}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-linea bg-white text-malta transition-colors hover:border-ambar hover:text-ambar disabled:opacity-30"
          title="Acercar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => setZoom(1)}
          className="rounded-md border border-linea bg-white px-2 py-1 text-xs text-tostado transition-colors hover:border-ambar hover:text-ambar"
          title="Restablecer zoom"
        >
          Reset
        </button>
      </div>

      {/* Árbol */}
      <div className="overflow-auto py-4">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
            position: "relative",
            width: svgWidth,
            height: svgHeight,
            margin: "0 auto",
          }}
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          >
            {lineas.map((l, i) => (
              <path
                key={i}
                d={`M ${l.x1} ${l.y1} C ${l.x1} ${(l.y1 + l.y2) / 2}, ${l.x2} ${(l.y1 + l.y2) / 2}, ${l.x2} ${l.y2}`}
                stroke="#DDD3C2"
                strokeWidth="2"
                fill="none"
              />
            ))}
          </svg>
          {nodos.map((nodo) => {
            const pos = posiciones.find((p) => p.id === nodo.id);
            if (!pos) return null;
            const esRaiz = nodo.id === arbol.id;
            return (
              <div
                key={nodo.id}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  width: NODO_WIDTH,
                  height: NODO_HEIGHT,
                }}
              >
                <Link
                  href={`/cervezas/${nodo.id}`}
                  className={`flex h-full w-full flex-col items-center justify-center rounded-lg border px-3 py-2 text-center transition-all hover:shadow-md ${
                    nodo.es_actual
                      ? "border-ambar bg-ambar/15 shadow-sm"
                      : "border-linea bg-white hover:border-ambar/50"
                  }`}
                >
                  <p className={`font-[family-name:var(--font-lora)] text-xs font-semibold leading-tight ${nodo.es_actual ? "text-ambar-oscuro" : "text-malta"}`}>
                    {nodo.nombre}
                  </p>
                  {nodo.username && (
                    <p className="mt-0.5 text-[10px] text-tostado">
                      {tRecetas("por")} {nodo.username}
                    </p>
                  )}
                  {esRaiz && (
                    <span className="mt-1 inline-block rounded-full bg-ambar/25 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ambar-oscuro">
                      Original
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}