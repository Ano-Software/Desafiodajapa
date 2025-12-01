import Image from "next/image";

const SUPERANDO_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/superando-limites-logo-jYmy4GflnLypOYHq.png";
const JAPA_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png";

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-white/5 px-5 py-4 text-sm shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex items-center gap-3">
        <Image
          src={SUPERANDO_LOGO}
          alt="Logo Superando Limites"
          width={72}
          height={72}
          className="h-14 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
          priority
        />
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
            Superando Limites
          </p>
          <p className="text-base font-semibold text-white">Grupo de Corridas</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs uppercase tracking-wide text-white/80">
        <Image
          src={JAPA_LOGO}
          alt="Logo Desafio da Japa"
          width={40}
          height={40}
          className="h-9 w-auto object-contain"
        />
        <span>Desafio da Japa</span>
      </div>
    </header>
  );
}
