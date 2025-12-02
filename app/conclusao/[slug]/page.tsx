import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChallengeForm } from "@/components/challenge-form";
import { getChallengeBySlug } from "@/lib/challenges";

const JAPA_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const challenge = getChallengeBySlug(params.slug);

  if (!challenge) {
    return {
      title: "Desafio nao encontrado",
      description:
        "O desafio informado nao foi localizado. Volte para a lista e escolha novamente.",
    };
  }

  return {
    title: `${challenge.name} | Registrar conclusao`,
    description:
      "Envie os dados para registrar a conclusao do desafio virtual do grupo Superando Limites.",
  };
}

export default function ChallengeConclusionPage({ params }: PageProps) {
  const slug = params.slug ?? "";
  const challenge = getChallengeBySlug(slug);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
          <div className="w-full space-y-4 rounded-3xl border border-red-100 bg-white/95 p-10 shadow-xl shadow-red-100/50">
            <h1 className="text-3xl font-semibold text-red-600">
              Desafio nao encontrado
            </h1>
            <p className="text-sm text-slate-600">
              O link acessado nao corresponde a nenhum desafio ativo no momento.
              Verifique se o endereco esta correto ou retorne para escolher outro
              desafio.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Voltar para os desafios
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-12 space-y-8">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/95 p-8 text-center shadow-xl shadow-slate-200/70">
          <Image
            src={JAPA_LOGO}
            alt="Logo Desafio da Japa"
            width={120}
            height={120}
            className="mx-auto h-24 w-auto"
            priority
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
            Conclusao de desafio
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {challenge.name}
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            {challenge.description ??
              "Preencha o formulario abaixo para registrar o resultado deste desafio virtual. Seus dados sao enviados diretamente para o grupo de corridas Superando Limites."}
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <ChallengeForm slug={slug} challenge={challenge} />
        </div>

        <Link
          href="/admin/login"
          className="text-xs text-slate-400 underline decoration-dotted hover:text-slate-500"
        >
          admin
        </Link>
      </main>
    </div>
  );
}
