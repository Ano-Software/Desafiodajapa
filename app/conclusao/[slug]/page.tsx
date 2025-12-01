import type { Metadata } from "next";
import Image from "next/image";
import { ChallengeForm } from "@/components/challenge-form";

type PageProps = {
  params: {
    slug?: string;
  };
};

const JAPA_LOGO =
  "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png";

function getChallengeName(slug?: string): string {
  if (!slug) return "Desafio virtual";

  try {
    const decoded = decodeURIComponent(slug);
    return decoded
      .split("-")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  } catch {
    return "Desafio virtual";
  }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const challengeName = getChallengeName(params.slug);
  return {
    title: `${challengeName} | Conclusao de desafio`,
    description: `Envie seu print e confirme a conclusao do ${challengeName} no Desafio da Japa / Superando Limites.`,
  };
}

export default function ChallengeConclusionPage({
  params,
}: {
  params: { slug: string };
}) {
  const challengeName = getChallengeName(params.slug);

  const challenge = {
    slug: params.slug ?? "",
    name: challengeName,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Image
              src={JAPA_LOGO}
              alt="Logo Desafio da Japa"
              width={120}
              height={120}
              className="h-24 w-auto"
              priority
            />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Conclusao de desafio
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {challengeName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Preencha os dados abaixo e envie o print do seu Strava para
              registrar a conclusao deste desafio virtual. Seu resultado sera
              salvo no sistema do grupo de corridas Superando Limites.
            </p>
          </div>

          <div className="mt-10">
            <ChallengeForm challenge={challenge} slug={challenge.slug} />
          </div>
        </div>
      </main>
    </div>
  );
}
