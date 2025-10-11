export type AnxietyLevelOptionsType = {
  id: string;
  label: string;
  description: string;
  difficulty: string;
};

export const anxietyLevelOptions: AnxietyLevelOptionsType[] = [
  {
    id: "0",
    label: "0 – Calm",
    description: "Completely relaxed, no anxiety",
    difficulty: "easy",
  },
  {
    id: "2",
    label: "2 – Mild",
    description: "Slight unease, manageable",
    difficulty: "easy",
  },
  {
    id: "4",
    label: "4 – Noticeable",
    description: "Clear anxiety, but can still function",
    difficulty: "medium",
  },
  {
    id: "6",
    label: "6 – Strong",
    description: "Very uncomfortable, intrusive symptoms",
    difficulty: "medium",
  },
  {
    id: "8",
    label: "8 – Intense",
    description: "Difficult to stay present, fear is high",
    difficulty: "hard",
  },
  {
    id: "10",
    label: "10 – Extreme",
    description: "Full panic, overwhelming, feels unbearable",
    difficulty: "hard",
  },
];
