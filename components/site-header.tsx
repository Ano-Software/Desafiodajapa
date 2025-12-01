import Image from "next/image";

const SUPERANDO_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/superando-limites-logo-jYmy4GflnLypOYHq.png";
const JAPA_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-slate-200 bg-white/90 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
        <div className="flex flex-1 items-center justify-start gap-2 sm:flex-none">
          <Image
            src={SUPERANDO_LOGO}
            alt="Logo Superando Limites"
            width={72}
            height={72}
            className="h-10 w-auto object-contain sm:h-12"
            priority
          />
        </div>
        <div className="flex flex-col items-center justify-center text-center leading-tight">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-900">
            Superando Limites
          </p>
          <p className="text-base font-semibold text-slate-900">
            Grupo de Corridas
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          <Image
            src={JAPA_LOGO}
            alt="Logo Desafio da Japa"
            width={48}
            height={48}
            className="h-10 w-auto object-contain sm:h-12"
          />
        </div>
      </div>
    </header>
  );
}
