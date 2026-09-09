import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg">
            VinilArt <span className="text-magenta">Sport</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Personalização desportiva. Uma vertente da VinilArt.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-xs uppercase tracking-[0.14em] text-cyan hover:underline"
          >
            Voltar à VinilArt
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-display text-xs tracking-[0.16em] text-muted-foreground">
              Navegar
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/loja" className="hover:text-cyan">
                  Loja
                </Link>
              </li>
              <li>
                <Link to="/personalizar" className="hover:text-cyan">
                  Personalizar
                </Link>
              </li>
              <li>
                <Link to="/equipamentos" className="hover:text-cyan">
                  Equipamentos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-xs tracking-[0.16em] text-muted-foreground">
              Mais
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/adeptos" className="hover:text-cyan">
                  Adeptos
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="hover:text-cyan">
                  Contactos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-xs tracking-[0.16em] text-muted-foreground">
              Contacto
            </p>
            <p className="mt-3 text-muted-foreground">
              Dados de contacto a confirmar.
            </p>
          </div>
        </div>
      </div>
      <div className="brush-rule" />
      <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} VinilArt Sport — versão de demonstração. Preços e
        produtos são placeholders.
      </div>
    </footer>
  );
}
