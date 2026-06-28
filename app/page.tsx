"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("landing");

  return (
    <main className="flex flex-col items-center justify-start px-6 pt-4 pb-8">
      <div className="mx-auto max-w-2xl text-center">
        <img
          src="/Logo_krausen.png"
          alt="Krausen"
          className="mx-auto w-80 sm:w-[420px]"
        />
        <p className="mt-0 font-[family-name:var(--font-lora)] text-xl leading-snug text-ambar-oscuro sm:text-2xl">
          {t("frase")}
        </p>
        <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-tostado sm:text-base">
          {t("descripcion")}
        </p>
        <Link
          href="/recetas"
          className="mt-5 inline-block rounded-md border border-ambar-oscuro/40 px-5 py-2 text-sm font-medium text-ambar-oscuro transition-colors hover:border-ambar-oscuro hover:bg-ambar/10"
        >
          {t("explorar")}
        </Link>
      </div>
    </main>
  );
}