import { Difficulty } from "@prisma/client";

export type JSONChallengeParse = {
  id: string;
  label: string;
  description: string;
  difficulty: Difficulty;
};
