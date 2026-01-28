import type { TaxonomyItem, TaxonomyType } from "@prisma/client";

export type FormFieldType = {
  id: string;
  label: string;
  description: string | null;
};

const keyFor = (
  type: TaxonomyType,
  slug: string,
  field: "label" | "description",
) => `taxonomy.${type}.${slug}.${field}`;

export function mapTaxonomiesToFormFields<
  T extends Pick<TaxonomyItem, "id" | "type" | "slug" | "description">,
>(taxonomies: T[]): Array<FormFieldType> {
  return taxonomies.map((x) => ({
    id: x.id,
    label: keyFor(x.type, x.slug, "label"),
    description: x.description ? keyFor(x.type, x.slug, "description") : null,
  })) as any;
}

export function mapTaxonomyToFormField<
  T extends Pick<TaxonomyItem, "id" | "type" | "slug" | "description">,
>(taxonomy: T): FormFieldType {
  return {
    id: taxonomy.id,
    label: keyFor(taxonomy.type, taxonomy.slug, "label"),
    description: taxonomy.description
      ? keyFor(taxonomy.type, taxonomy.slug, "description")
      : null,
  };
}
