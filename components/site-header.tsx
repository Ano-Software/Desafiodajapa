import Image from "next/image";

const SUPERANDO_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/superando-limites-logo-jYmy4GflnLypOYHq.png";
const JAPA_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-center px-4 py-6 text-black">
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl border border-black/10 bg-white/80 px-6 py-4 text-center shadow-xl shadow-black/10">
        <Image
          src={SUPERANDO_LOGO}
          alt="Logo Superando Limites"
          width={72}
          height={72}
          className="h-10 w-auto object-contain sm:h-12"
          priority
        />
        <div className="flex flex-col items-center text-center leading-tight">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black">
            Superando Limites
          </p>
          <p className="text-base font-semibold text-black">Grupo de Corridas</p>
        </div>
        <Image
          src={JAPA_LOGO}
          alt="Logo Desafio da Japa"
          width={40}
          height={40}
          className="h-10 w-auto object-contain sm:h-12"
        />
      </div>
    </header>
  );
}
