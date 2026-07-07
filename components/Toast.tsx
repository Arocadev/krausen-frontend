"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  mensaje: string;
  tipo?: "error" | "exito" | "info";
  onClose: () => void;
};

export function Toast({ mensaje, tipo = "error", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const estilos = {
    error: "bg-red-50 border-red-200 text-red-800",
    exito: "bg-green-50 border-green-200 text-green-800",
    info: "bg-ambar/10 border-ambar/30 text-ambar-oscuro",
  }[tipo];

  const iconos = {
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    exito: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  }[tipo];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${estilos}`}>
      <span className="mt-0.5 shrink-0">{iconos}</span>
      <p className="flex-1 text-sm leading-relaxed">{mensaje}</p>
      <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ mensaje: string; tipo: "error" | "exito" | "info" } | null>(null);

  const mostrar = (mensaje: string, tipo: "error" | "exito" | "info" = "error") => {
    setToast({ mensaje, tipo });
  };

  const cerrar = () => setToast(null);

  const ToastComponent = toast ? <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={cerrar} /> : null;

  return { mostrar, ToastComponent };
}