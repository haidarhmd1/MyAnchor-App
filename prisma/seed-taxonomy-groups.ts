// prisma/seed-taxonomy-groups.ts
import "dotenv/config";
import prisma from "../lib/prisma";

const locationGroups = [
  { slug: "social_events", label: "Social & events", sortOrder: 10 },
  { slug: "travel_specifics", label: "Travel specifics", sortOrder: 20 },
  { slug: "everyday_public", label: "Everyday public places", sortOrder: 30 },
  {
    slug: "performance_interaction",
    label: "Performance/interaction",
    sortOrder: 40,
  },
  {
    slug: "movement_confined",
    label: "Movement & confined spaces",
    sortOrder: 50,
  },
  { slug: "medical_contexts", label: "Medical contexts", sortOrder: 60 },
  { slug: "gentle_starters", label: "Gentle starters", sortOrder: 70 },
  { slug: "other", label: "Others", sortOrder: 90 },
];

const groupMap: Record<string, string> = {
  // map taxonomy slug -> group slug
  event_birthday: "social_events",
  event_company: "social_events",
  event_gathering: "social_events",
  event_festival: "social_events",

  travel_airport: "travel_specifics",
  travel_flight: "travel_specifics",
  transport_rideshare: "travel_specifics",

  shopping_supermarket: "everyday_public",
  mall: "everyday_public",
  dining_restaurant: "everyday_public",
  cinema: "everyday_public",
  gym: "everyday_public",
  religious_service: "everyday_public",

  presentation: "performance_interaction",
  interview: "performance_interaction",
  phone_call: "performance_interaction",
  video_call: "performance_interaction",

  elevator: "movement_confined",
  bridge_tunnel: "movement_confined",
  highway_driving: "movement_confined",

  medical_dentist: "medical_contexts",
  medical_hospital: "medical_contexts",

  night_walk: "gentle_starters",
  // any you don't map fall into "other"
};

async function main() {
  // 1) upsert groups
  const createdGroups = new Map<string, string>(); // slug -> id
  for (const g of locationGroups) {
    const upserted = await prisma.taxonomyGroup.upsert({
      where: { type_slug: { type: "LOCATION", slug: g.slug } },
      update: { label: g.label, sortOrder: g.sortOrder },
      create: {
        type: "LOCATION",
        slug: g.slug,
        label: g.label,
        sortOrder: g.sortOrder,
      },
    });
    createdGroups.set(g.slug, upserted.id);
  }

  // 2) attach existing LOCATION items to groups
  const locations = await prisma.taxonomy.findMany({
    where: { type: "LOCATION" },
    select: { id: true, slug: true },
  });

  for (const loc of locations) {
    const groupSlug = groupMap[loc.slug] ?? "other";
    const groupId = createdGroups.get(groupSlug)!;

    await prisma.taxonomy.update({
      where: { id: loc.id },
      data: { groupId },
    });
  }
}

main().finally(() => prisma.$disconnect());
