import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CHALLENGE_LIST } from "@/lib/challenges";

const SUPERANDO_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/superando-limites-logo-jYmy4GflnLypOYHq.png";
const JAPA_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16">
        <section className="rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <Image
              src={SUPERANDO_LOGO}
              alt="Logo Superando Limites"
              width={140}
              height={140}
              className="h-24 w-auto object-contain"
              priority
            />
            <div className="flex-1 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                Desafio da Japa
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                Corridas virtuais do grupo Superando Limites
              </h1>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Clique no desafio que voce comprou para registrar a conclusao. O
                formulario ja leva o nome do desafio e seus dados sao enviados
                direto para a equipe Superando Limites.
              </p>
              <div>
                <a
                  href="https://superandolimitesofc.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Ir para superandolimitesofc.com.br
                </a>
              </div>
            </div>
            <Image
              src={JAPA_LOGO}
              alt="Logo Desafio da Japa"
              width={140}
              height={140}
              className="h-24 w-auto object-contain"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
              Desafios ativos
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Selecione o desafio e registre sua conclusao
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cada botao leva diretamente ao formulario /conclusao/[slug] correto.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {CHALLENGE_LIST.map((challenge) => (
              <article
                key={challenge.slug}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="space-y-3">
                  {challenge.badge && (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {challenge.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-slate-900">
                    {challenge.name}
                  </h3>
                  {challenge.highlight && (
                    <p className="text-sm font-semibold text-emerald-600">
                      {challenge.highlight}
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    {challenge.description}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={`/conclusao/${challenge.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    Registrar conclusao
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-center">
          <Link
            href="/admin/login"
            className="text-xs text-slate-400 underline decoration-dotted hover:text-slate-500"
          >
            admin
          </Link>
        </div>
      </div>
    </main>
  );
}
