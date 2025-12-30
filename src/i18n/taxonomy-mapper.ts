/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Difficulty, Taxonomy, TaxonomyType } from "@prisma/client";

export type TFn = (key: string, values?: Record<string, any>) => string;

export type FormFieldType = {
  id: string;
  label: string;
  description: string | null;
};

export type FormFieldWithDifficulty = FormFieldType & {
  difficulty: Difficulty | null;
};

const keyFor = (
  type: TaxonomyType,
  slug: string,
  field: "label" | "description",
) => `taxonomy.${type}.${slug}.${field}`;

/**
 * DB taxonomy -> translated fields (keeps difficulty if present)
 */
export function mapTaxonomiesToFormFields<
  T extends Pick<Taxonomy, "id" | "type" | "slug" | "description"> & {
    difficulty?: Difficulty | null;
  },
>(
  taxonomies: T[],
): Array<
  FormFieldType & {
    difficulty: T["difficulty"] extends undefined ? never : Difficulty | null;
  }
> {
  return taxonomies.map((x) => ({
    id: x.id,
    label: keyFor(x.type, x.slug, "label"),
    description: x.description ? keyFor(x.type, x.slug, "description") : null,
    ...(Object.prototype.hasOwnProperty.call(x, "difficulty")
      ? { difficulty: (x.difficulty ?? null) as Difficulty | null }
      : {}),
  })) as any;
}

/**
 * Single taxonomy -> translated fields (keeps difficulty if present)
 */
export function mapTaxonomyToFormField<
  T extends Pick<Taxonomy, "id" | "type" | "slug" | "description"> & {
    difficulty?: Difficulty | null;
  },
>(taxonomy: T): FormFieldType & { difficulty?: Difficulty | null } {
  return {
    id: taxonomy.id,
    label: keyFor(taxonomy.type, taxonomy.slug, "label"),
    description: taxonomy.description
      ? keyFor(taxonomy.type, taxonomy.slug, "description")
      : null,
    ...(Object.prototype.hasOwnProperty.call(taxonomy, "difficulty")
      ? { difficulty: taxonomy.difficulty ?? null }
      : {}),
  };
}
