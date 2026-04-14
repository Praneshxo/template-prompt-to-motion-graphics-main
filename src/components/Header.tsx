import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  asLink?: boolean;
}

export function Header({ asLink = false }: HeaderProps) {
  const LogoContent = (
    <div className="flex items-center gap-3">
      <Image src="/logo-white.svg" alt="Nex" width={32} height={32} />
      <span className="text-xl font-bold text-white font-sans">
        Nex
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-between w-full">
      {asLink ? (
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          {LogoContent}
        </Link>
      ) : (
        LogoContent
      )}

      <nav className="flex items-center gap-6">
        <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
          Templates
        </Link>
      </nav>
    </div>
  );
}
