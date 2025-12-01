import type { Metadata } from "next";
import { ChallengeForm } from "@/components/challenge-form";

type PageProps = {
  params: {
    slug?: string;
  };
};

const DEFAULT_CHALLENGE_NAME = "Desafio virtual";

function formatChallengeNameFromSlug(slug?: string) {
  if (!slug) {
    return DEFAULT_CHALLENGE_NAME;
  }

  let decoded = "";
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    decoded = slug;
  }

  const cleaned = decoded
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return DEFAULT_CHALLENGE_NAME;
  }

  return cleaned
    .split(" ")
    .map((word) => {
      if (!word) return "";
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function generateMetadata({ params }: PageProps): Metadata {
  const challengeName = formatChallengeNameFromSlug(params.slug);
  const title = `Desafio - ${challengeName} - Conclusao`;
  const description = `Envie o comprovante do ${challengeName} para concluir o desafio e registrar sua conquista.`;

  return {
    title,
    description,
  };
}

export default function ChallengeConclusionPage({ params }: PageProps) {
  const rawSlug = params.slug ?? "";
  const challengeName = formatChallengeNameFromSlug(rawSlug);

  const challenge = {
    slug: rawSlug,
    name: challengeName,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <div className="rounded-3xl bg-white/80 shadow-xl shadow-slate-200 border border-slate-200 px-6 py-8 sm:px-10 sm:py-10 backdrop-blur">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold tracking-[0.3em] text-emerald-500 uppercase">
                Conclusao de desafio
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                {challenge.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                Preencha os dados abaixo e envie o print do seu Strava para
                registrar a conclusao deste desafio virtual. Seu resultado sera
                salvo no sistema do grupo de corridas Superando Limites.
              </p>
            </div>

            <ChallengeForm challenge={challenge} slug={challenge.slug} />

            <p className="mt-6 text-[11px] sm:text-xs text-slate-500 text-center">
              Dica: use exatamente este link na pagina do produto/desafio da
              sua compra. Assim, ao clicar em &quot;Concluir desafio&quot;, o
              formulario ja abrira com o nome correto do desafio.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
