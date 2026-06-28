"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { cargando } = useAuth();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!cargando) setListo(true);
  }, [cargando]);

  return (
    <div className={`flex min-h-screen flex-col transition-opacity duration-150 ${listo ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
}