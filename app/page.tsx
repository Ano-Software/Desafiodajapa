import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-800 flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-3xl bg-white border border-slate-200 shadow-lg p-10 space-y-8 text-center">
        <div className="flex items-center justify-center gap-6">
          <Image
            src="https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png"
            alt="Logo Desafio da Japa"
            width={90}
            height={90}
            className="drop-shadow-md"
          />

          <Image
            src="https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/superando-limites-logo-jYmy4GflnLypOYHq.png"
            alt="Logo Superando Limites"
            width={120}
            height={120}
            className="drop-shadow-md"
          />
        </div>

        <p className="text-xs tracking-[0.25em] text-emerald-600 uppercase">
          Desafio da Japa
        </p>

        <h1 className="text-2xl font-semibold leading-tight text-slate-900">
          Corridas Virtuais - Grupo de Corridas Superando Limites
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Este site e exclusivo para registrar a conclusao dos desafios virtuais
          comprados no site{" "}
          <span className="font-semibold text-slate-900">
            superandolimitesofc.com.br
          </span>
          . Para enviar seu comprovante, clique no link de conclusao disponivel
          na pagina do desafio que voce comprou.
        </p>

        <div className="pt-2">
          <a
            href="https://superandolimitesofc.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition shadow-md"
          >
            Ir para o site e comprar um desafio
          </a>
        </div>
      </div>
      <a
        href="/admin/login"
        className="absolute bottom-4 left-4 text-[10px] text-slate-400/70 underline decoration-dotted hover:text-slate-400"
      >
        admin
      </a>
    </main>
  );
}
