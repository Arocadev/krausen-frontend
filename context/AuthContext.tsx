"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Usuario = {
  id: number;
  email: string;
  rol: string;
} | null;

type AuthContextType = {
  usuario: Usuario;
  login: (token: string) => void;
  logout: () => void;
  cargando: boolean;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  login: () => {},
  logout: () => {},
  cargando: true,
});

function decodificarToken(token: string): Usuario {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) return null;
    return { id: payload.id, email: payload.sub, rol: payload.rol };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const datos = decodificarToken(token);
      if (datos) setUsuario(datos);
      else localStorage.removeItem("token");
    }
    setCargando(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUsuario(decodificarToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);