"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detalle || err.response?.data?.detail || "No se pudo iniciar sesión");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-espuma px-6 py-20">
      <div className="mx-auto max-w-md rounded-lg border border-linea bg-white p-10">
        <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">
          {t("bienvenido")}
        </h1>
        <p className="mt-2 text-tostado">{t("subtituloLogin")}</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-malta">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar"
            />
          </div>

          <div>
            <PasswordInput id="password" label={t("password")} value={password} onChange={setPassword} />
            <p className="mt-2 text-right text-sm">
              <Link href="/recuperar-password" className="font-medium text-ambar-oscuro hover:underline">
                {t("olvidaste")}
              </Link>
            </p>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-md bg-ambar px-6 py-3 font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
          >
            {enviando ? t("entrando") : t("entrar")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-tostado">
          {t("noTienesCuenta")}{" "}
          <Link href="/registro" className="font-medium text-ambar-oscuro hover:underline">
            {t("creaUna")}
          </Link>
        </p>
      </div>
    </main>
  );
}