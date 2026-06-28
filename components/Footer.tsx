"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-navbar mt-auto">
      <div className="mx-auto max-w-6xl px-0 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-espuma/50">
            © {new Date().getFullYear()} Krausen
          </span>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="text-xs text-espuma/60 transition-colors hover:text-crema">
              {t("faq")}
            </Link>
            <Link href="/aviso-legal" className="text-xs text-espuma/60 transition-colors hover:text-crema">
              {t("avisoLegal")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}