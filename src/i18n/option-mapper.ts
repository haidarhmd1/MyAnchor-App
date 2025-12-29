/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Taxonomy, TaxonomyType, Difficulty } from "@prisma/client";

export type TFn = (key: string, values?: Record<string, any>) => string;

export type FormFieldType = {
  id: string;
  label: string;
  description: string | null;
  // keep these so filtering + other UI logic doesn't break
  difficulty?: Difficulty | null;
  type?: TaxonomyType;
  slug?: string;
};

const keyFor = (
  type: TaxonomyType,
  slug: string,
  field: "label" | "description",
) => `taxonomy.${type}.${slug}.${field}`;

/**
 * Maps DB taxonomies to translated UI fields using next-intl.
 * Keeps difficulty/type/slug so existing UI logic (filters, etc.) still works.
 */
export function mapTaxonomiesToFormFields<
  T extends Pick<Taxonomy, "id" | "type" | "slug" | "description"> & {
    difficulty?: Difficulty | null;
  },
>(taxonomies: T[], t: TFn): FormFieldType[] {
  return taxonomies.map((x) => ({
    id: x.id,
    type: x.type,
    slug: x.slug,
    difficulty: "difficulty" in x ? (x.difficulty ?? null) : null,
    label: t(keyFor(x.type, x.slug, "label")),
    description: x.description
      ? t(keyFor(x.type, x.slug, "description"))
      : null,
  }));
}

/**
 * Single taxonomy item.
 */
export function mapTaxonomyToFormField<
  T extends Pick<Taxonomy, "id" | "type" | "slug" | "description"> & {
    difficulty?: Difficulty | null;
  },
>(taxonomy: T, t: TFn): FormFieldType {
  return {
    id: taxonomy.id,
    type: taxonomy.type,
    slug: taxonomy.slug,
    difficulty: "difficulty" in taxonomy ? (taxonomy.difficulty ?? null) : null,
    label: t(keyFor(taxonomy.type, taxonomy.slug, "label")),
    description: taxonomy.description
      ? t(keyFor(taxonomy.type, taxonomy.slug, "description"))
      : null,
  };
}
