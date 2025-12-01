import type { Metadata } from "next";
import Image from "next/image";
import { ChallengeForm } from "@/components/challenge-form";

type ChallengePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ChallengePageProps): Promise<Metadata> {
  const slug = params.slug ?? "";
  let decodedSlug = "";

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  const challengeName = decodedSlug || "Desafio Virtual";
  const title = `${challengeName} | Registro de conclusao`;
  const description = `Envie seu print e confirme sua conclusao do ${challengeName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const slug = params.slug ?? "";
  let decodedSlug = "";

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  const challenge = {
    slug,
    name: decodedSlug || "Desafio Virtual",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 px-4 py-12 text-slate-800">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <Image
              src="https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/japa-sem-fundo-jNOUaM6FKlXFnQyz.png"
              alt="Logo Desafio da Japa"
              width={95}
              height={95}
              className="drop-shadow-xl"
              priority
            />
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">
              Desafio Virtual
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {challenge.name}
            </h1>
            <p className="text-sm text-slate-600">
              Preencha os dados abaixo para registrar a conclusao do seu
              desafio.
            </p>
          </div>

          <div className="mt-8">
            <ChallengeForm challenge={challenge} slug={slug} />
          </div>
        </div>
      </div>
    </main>
  );
}
