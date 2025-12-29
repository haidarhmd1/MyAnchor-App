export type AnxietyLevelOption = {
  id: string;
  value: number;
  difficulty: "easy" | "medium" | "hard";
  label: string;
  description: string;
};

export const anxietyLevelOptions: AnxietyLevelOption[] = [
  {
    id: "0",
    value: 0,
    label: "anxietyLevels.0.label",
    description: "anxietyLevels.0.description",
    difficulty: "easy",
  },
  {
    id: "2",
    value: 2,
    label: "anxietyLevels.2.label",
    description: "anxietyLevels.2.description",
    difficulty: "easy",
  },
  {
    id: "4",
    value: 4,
    label: "anxietyLevels.4.label",
    description: "anxietyLevels.4.description",
    difficulty: "medium",
  },
  {
    id: "6",
    value: 6,
    label: "anxietyLevels.6.label",
    description: "anxietyLevels.6.description",
    difficulty: "medium",
  },
  {
    id: "8",
    value: 8,
    label: "anxietyLevels.8.label",
    description: "anxietyLevels.8.description",
    difficulty: "hard",
  },
  {
    id: "10",
    value: 10,
    label: "anxietyLevels.10.label",
    description: "anxietyLevels.10.description",
    difficulty: "hard",
  },
];
