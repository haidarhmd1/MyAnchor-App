export type ExposureRatingOptionsType = {
  id: string;
  label: string;
  description: string;
};

export const exposureRatingOptions: ExposureRatingOptionsType[] = [
  {
    id: "0",
    label: "0 - Very easy",
    description: "Felt calm, no struggle at all",
  },
  { id: "1", label: "1", description: "Almost no difficulty" },
  {
    id: "2",
    label: "2",
    description: "Very manageable, only slight discomfort",
  },
  {
    id: "3",
    label: "3",
    description: "Mild challenge but stayed comfortable",
  },
  { id: "4", label: "4", description: "Some effort needed but manageable" },
  {
    id: "5",
    label: "5 - Moderate",
    description: "Challenging at times, but doable",
  },
  { id: "6", label: "6", description: "Noticeably difficult, but I stayed" },
  { id: "7", label: "7", description: "Quite hard, struggled to continue" },
  { id: "8", label: "8", description: "Very hard, almost stopped" },
  { id: "9", label: "9", description: "Extremely difficult, barely managed" },
  {
    id: "10",
    label: "10 - Overwhelming",
    description: "Could not continue / had to stop",
  },
];
