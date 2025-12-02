export type ChallengeInfo = {
  name: string;
  description: string;
  badge?: string;
  highlight?: string;
};

export type ChallengeListItem = ChallengeInfo & {
  slug: string;
};

const CHALLENGE_DATA: ChallengeListItem[] = [
  {
    slug: "thor-novembro-25",
    name: "Desafio Thor Novembro 25",
    description:
      "Percurso heroico inspirado no Deus do Trovao para voce fechar novembro com forca total.",
    badge: "Novembro 2025",
    highlight: "Modalidades 5K / 10K",
  },
  {
    slug: "flash-dezembro-25",
    name: "Desafio Flash Dezembro 25",
    description:
      "Sprint final do ano com provas eletrizantes para encerrar a temporada com velocidade.",
    badge: "Dezembro 2025",
    highlight: "Modalidades 5K / 10K",
  },
  {
    slug: "marco-especial-26",
    name: "Especial Superando Limites Marco 26",
    description:
      "Prova comemorativa dedicada a comunidade Desafio da Japa com percurso livre.",
    badge: "Marco 2026",
    highlight: "Percurso livre",
  },
  {
    slug: "turno-ouro-japa",
    name: "Turno Ouro Desafio da Japa",
    description:
      "Categoria exclusiva para quem concluiu toda a serie Ouro e quer manter o ritmo.",
    badge: "Serie Ouro",
    highlight: "Percurso livre",
  },
  {
    slug: "meia-superando",
    name: "Meia Maratona Superando Limites",
    description: "21K para quem quer ir alem na corrida virtual.",
    badge: "Distancia oficial",
    highlight: "21K",
  },
];

export const CHALLENGE_MAP: Record<string, ChallengeInfo> = CHALLENGE_DATA.reduce(
  (map, { slug, ...info }) => {
    map[slug] = info;
    return map;
  },
  {} as Record<string, ChallengeInfo>
);

export const CHALLENGE_LIST: ChallengeListItem[] = CHALLENGE_DATA;

export function getChallengeBySlug(slug: string): ChallengeInfo | undefined {
  return CHALLENGE_MAP[slug];
}
