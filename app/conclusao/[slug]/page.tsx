import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ChallengeForm } from "@/components/challenge-form";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const decodedSlug = decodeURIComponent(params.slug || "");
  const challengeName =
    decodedSlug.trim() || "Desafio virtual · Conclusão de prova";

  return {
    title: `${challengeName} · Conclusão | Desafio da Japa`,
    description:
      "Envie o comprovante da sua corrida virtual para concluir o desafio e registrar sua conquista.",
  };
}

export default function ChallengeConclusionPage({ params }: PageProps) {
  const rawSlug = params.slug;

  // Se realmente não tiver slug na URL (caso extremo), 404.
  if (!rawSlug) {
    notFound();
  }

  const decodedSlug = decodeURIComponent(rawSlug);
  const challenge = {
    slug: rawSlug,
    name: decodedSlug.trim() || "Desafio virtual",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <SiteHeader />

      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <div className="rounded-3xl bg-white/80 shadow-xl shadow-slate-200 border border-slate-200 px-6 py-8 sm:px-10 sm:py-10 backdrop-blur">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold tracking-[0.3em] text-emerald-500 uppercase">
                Conclusão de desafio
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                {challenge.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                Preencha os dados abaixo e envie o print do seu Strava para
                registrar a conclusão deste desafio virtual. Seu resultado será
                salvo no sistema do grupo de corridas Superando Limites.
              </p>
            </div>

            <ChallengeForm challenge={challenge} slug={challenge.slug} />

            <p className="mt-6 text-[11px] sm:text-xs text-slate-500 text-center">
              Dica: use exatamente este link na página do produto/desafio da
              sua compra. Assim, ao clicar em &quot;Concluir desafio&quot;, o
              formulário já abrirá com o nome correto do desafio.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
