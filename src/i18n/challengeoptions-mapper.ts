import { ChallengeOption, Engagement } from "@prisma/client";

export type TFn = (key: string, values?: Record<string, any>) => string;

export type FormFieldType = {
  id: string;
  label: string;
  slug: string;
  description: string | null;
  engagement: Engagement;
};

export type FormFieldWithDifficulty = FormFieldType;

const keyFor = (slug: string, field: "label" | "description") =>
  `taxonomy.CHALLENGE.${slug}.${field}`;

const keyForEngagement = (
  engagement: Engagement,
  field: "label" | "title" | "description",
) => `common.engagement.${engagement}.${field}`;

export function mapChallengeOptionsToFormFields<
  T extends Pick<
    ChallengeOption,
    "id" | "slug" | "label" | "description" | "engagement"
  >,
>(challengeOption: T[]): Array<FormFieldType> {
  return challengeOption.map((x) => ({
    id: x.id,
    label: keyFor(x.slug, "label"),
    slug: x.slug,
    description: x.description ? keyFor(x.slug, "description") : null,
    engagement: x.engagement,
  })) as any;
}

export function mapSingleChallengeOptionItemToTranslater(challengeOption: {
  id: string;
  createdAt: Date;
  slug: string;
  description: string | null;
  engagement: Engagement;
}): {
  label: string;
  description: string | null;
  engagement: { label: string; title: string; description: string };
} {
  return {
    label: keyFor(challengeOption.slug, "label"),
    description: challengeOption.description
      ? keyFor(challengeOption.slug, "description")
      : null,
    engagement: {
      label: keyForEngagement(challengeOption.engagement, "label"),
      title: keyForEngagement(challengeOption.engagement, "title"),
      description: keyForEngagement(challengeOption.engagement, "description"),
    },
  };
}
