export type ChallengeInfo = {
  name: string;
  description: string;
};

export const CHALLENGE_MAP: Record<string, ChallengeInfo> = {
  "flash-dezembro-25": {
    name: "Desafio Virtual Flash - Dezembro/2025",
    description:
      "Sprint final do ano com provas de 5K e 10K para fechar a temporada com energia total.",
  },
  "marco-especial-26": {
    name: "Especial Superando Limites - Marco/2026",
    description:
      "Prova tematica comemorando a comunidade Desafio da Japa e seus recordes.",
  },
  "turno-ouro-japa": {
    name: "Turno Ouro | Desafio da Japa",
    description:
      "Percurso livre para atletas que completaram todos os desafios da serie Ouro.",
  },
  "meia-superando": {
    name: "Meia Maratona Superando Limites",
    description: "21K oficiais para atletas que querem ir alem na corrida virtual.",
  },
};

export function getChallengeBySlug(slug: string): ChallengeInfo | undefined {
  return CHALLENGE_MAP[slug];
}
