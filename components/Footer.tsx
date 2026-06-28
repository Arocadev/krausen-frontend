import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navbar mt-auto">
      <div className="mx-auto max-w-6xl px-0 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-espuma/50">
            © {new Date().getFullYear()} Krausen
          </span>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="text-xs text-espuma/60 transition-colors hover:text-crema">
              FAQ
            </Link>
            <Link href="/aviso-legal" className="text-xs text-espuma/60 transition-colors hover:text-crema">
              Aviso legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}