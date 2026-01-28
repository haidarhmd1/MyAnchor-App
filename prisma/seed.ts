// prisma/seed.ts

import "dotenv/config";
import { Engagement, TaxonomyType } from "@prisma/client";
import prisma from "../lib/prisma";

type EngagementKey = "stay" | "participate" | "stretch";

type SeedItem = {
  id: string;
  label: string;
  description?: string;
  engagement?: EngagementKey;
};

function mapEngagement(e?: EngagementKey): Engagement | undefined {
  if (!e) return undefined;
  if (e === "stay") return "STAY";
  if (e === "participate") return "PARTICIPATE";
  return "STRETCH";
}

async function upsertLocationOptions(items: SeedItem[]) {
  for (const item of items) {
    await prisma.locationOption.upsert({
      where: { slug: item.id },
      update: {
        label: item.label,
        description: item.description ?? null,
      },
      create: {
        slug: item.id,
        label: item.label,
        description: item.description ?? null,
      },
    });
  }
}

async function upsertChallengeOptions(items: SeedItem[]) {
  for (const item of items) {
    const engagement = mapEngagement(item.engagement);
    if (!engagement) {
      throw new Error(
        `ChallengeOption "${item.id}" is missing engagement (stay/participate/stretch)`,
      );
    }

    await prisma.challengeOption.upsert({
      where: { slug: item.id },
      update: {
        label: item.label,
        description: item.description ?? null,
        engagement,
      },
      create: {
        slug: item.id,
        label: item.label,
        description: item.description ?? null,
        engagement,
      },
    });
  }
}

async function upsertTaxonomyItems(type: TaxonomyType, items: SeedItem[]) {
  for (const item of items) {
    await prisma.taxonomyItem.upsert({
      where: { slug: item.id },
      update: {
        type,
        label: item.label,
        description: item.description ?? null,
      },
      create: {
        type,
        slug: item.id,
        label: item.label,
        description: item.description ?? null,
      },
    });
  }
}

async function main() {
  const locationOptions: SeedItem[] = [
    {
      id: "home",
      label: "Home",
      description: "At home / familiar place",
    },
    {
      id: "outside",
      label: "Outside",
      description: "Street, park, small errands",
    },
    {
      id: "work",
      label: "Work/School",
      description: "Tasks, meetings, classes",
    },
    {
      id: "transport",
      label: "Transport",
      description: "Bus, train, car rides",
    },
    {
      id: "crowd",
      label: "Crowd/Queue",
      description: "Busy shops, waiting in line",
    },

    {
      id: "event_birthday",
      label: "Birthday",
      description: "Attend a birthday gathering",
    },
    {
      id: "event_company",
      label: "Company Event",
      description: "Work social, offsite, party",
    },
    {
      id: "event_gathering",
      label: "Friends Gathering",
      description: "Small/medium social meetup",
    },
    {
      id: "event_festival",
      label: "Festival/Concert",
      description: "Large crowd, loud music",
    },

    {
      id: "travel_airport",
      label: "Airport",
      description: "Check-in, security, gate",
    },
    {
      id: "travel_flight",
      label: "Flight",
      description: "Short- or long-haul flight",
    },
    {
      id: "transport_rideshare",
      label: "Ride Share/Taxi",
      description: "Uber/Taxi alone",
    },

    {
      id: "shopping_supermarket",
      label: "Supermarket",
      description: "Aisles, checkout line",
    },
    {
      id: "mall",
      label: "Shopping Mall",
      description: "Enclosed, busy space",
    },
    {
      id: "dining_restaurant",
      label: "Restaurant/Café",
      description: "Stay through full meal",
    },
    {
      id: "cinema",
      label: "Cinema/Theater",
      description: "Sit through screening/show",
    },
    {
      id: "gym",
      label: "Gym/Class",
      description: "Tolerate heartbeat sensations",
    },
    {
      id: "religious_service",
      label: "Religious Service",
      description: "Stay for full service",
    },

    {
      id: "presentation",
      label: "Presentation/Meeting",
      description: "Speak or stay present",
    },
    {
      id: "interview",
      label: "Interview",
      description: "Job/School interview",
    },
    {
      id: "phone_call",
      label: "Phone Call",
      description: "Make/receive & stay on call",
    },
    {
      id: "video_call",
      label: "Video Call",
      description: "Camera on, stay engaged",
    },

    {
      id: "elevator",
      label: "Elevator",
      description: "Ride and remain inside",
    },
    {
      id: "bridge_tunnel",
      label: "Bridge/Tunnel",
      description: "Cross or drive through",
    },
    {
      id: "highway_driving",
      label: "Highway Driving",
      description: "Sustained speed traffic",
    },

    {
      id: "medical_dentist",
      label: "Dentist",
      description: "Sit through appointment",
    },
    {
      id: "medical_hospital",
      label: "Hospital/Clinic",
      description: "Waiting room, procedures",
    },

    {
      id: "night_walk",
      label: "Night Walk",
      description: "Short evening neighborhood walk",
    },
  ];

  const challenges: SeedItem[] = [
    {
      id: "short_walk",
      label: "Short Walk",
      description: "5–10 minute walk in the neighborhood",
      engagement: "stay",
    },
    {
      id: "corner_shop",
      label: "Small Shop",
      description: "Enter a local store and buy one item",
      engagement: "participate",
    },
    {
      id: "coffee_takeaway",
      label: "Coffee To-Go",
      description: "Order a takeaway drink and wait",
      engagement: "participate",
    },
    {
      id: "friend_chat",
      label: "Brief Conversation",
      description: "Small talk with a friend or neighbor",
      engagement: "participate",
    },

    {
      id: "supermarket_quick",
      label: "Quick Supermarket Visit",
      description: "Stay 5–10 minutes and use checkout",
      engagement: "participate",
    },
    {
      id: "bus_one_stop",
      label: "Bus Ride (1 Stop)",
      description: "Ride one stop and remain seated",
      engagement: "stay",
    },
    {
      id: "restaurant_meal",
      label: "Eat Out",
      description: "Sit down and finish a meal",
      engagement: "stretch",
    },
    {
      id: "exercise_session",
      label: "Light Exercise",
      description: "20-minute workout while tolerating heart rate",
      engagement: "participate",
    },
    {
      id: "social_small",
      label: "Small Gathering",
      description: "Spend 30–60 minutes with 2–3 people",
      engagement: "participate",
    },

    {
      id: "crowded_train",
      label: "Crowded Train / Bus",
      description: "Stay for several stops during rush hour",
      engagement: "stretch",
    },
    {
      id: "public_speaking",
      label: "Speak in Public",
      description: "Presentation, class, or group talk",
      engagement: "stretch",
    },
    {
      id: "mall_weekend",
      label: "Busy Mall",
      description: "Walk through mall at peak time",
      engagement: "stretch",
    },
    {
      id: "theater_movie",
      label: "Cinema / Theater",
      description: "Sit through full screening or event",
      engagement: "stretch",
    },
    {
      id: "airport_checkin",
      label: "Airport",
      description: "Go through security and wait at gate",
      engagement: "stretch",
    },
    {
      id: "flight_short",
      label: "Short Flight",
      description: "Domestic or short-haul flight",
      engagement: "stretch",
    },
    {
      id: "social_large",
      label: "Large Gathering",
      description: "Spend 30–60 minutes in a crowded place",
      engagement: "stretch",
    },

    {
      id: "doctor_waiting",
      label: "Doctor Appointment",
      description: "Wait through clinic visit",
      engagement: "participate",
    },
    {
      id: "dentist_chair",
      label: "Dentist",
      description: "Sit through routine checkup",
      engagement: "stretch",
    },

    {
      id: "video_meeting",
      label: "Video Call",
      description: "Stay engaged with camera on",
      engagement: "stretch",
    },
    {
      id: "phone_call_stranger",
      label: "Phone Call",
      description: "Call a stranger (e.g., booking an appointment)",
      engagement: "participate",
    },
  ];

  const avoidanceReasons: SeedItem[] = [
    {
      id: "crowds_overwhelming",
      label: "Large gatherings",
      description: "Too overwhelming, fear of losing control",
    },
    {
      id: "loud_noises",
      label: "Loud noises",
      description: "Irritating or overwhelming sound triggers",
    },
    {
      id: "fear_judgment",
      label: "Fear of judgment",
      description: "Worried about embarrassment or people noticing",
    },
    {
      id: "fear_panic",
      label: "Fear of panic attack",
      description: "Avoiding in case strong symptoms come up",
    },
    {
      id: "trapped_feeling",
      label: "Feeling trapped",
      description: "No easy way to leave or escape",
    },
    {
      id: "social_pressure",
      label: "Social pressure",
      description: "Expectation to talk, perform, or engage",
    },
    {
      id: "physical_exertion",
      label: "Physical exertion",
      description: "Raised heartbeat or breathlessness feels unsafe",
    },
    {
      id: "medical_fear",
      label: "Medical fears",
      description: "Hospitals, dentists, or procedures feel dangerous",
    },
    {
      id: "confined_spaces",
      label: "Confined spaces",
      description: "Elevators, tunnels, or traffic feel suffocating",
    },
    {
      id: "uncertainty",
      label: "Unpredictable situations",
      description: "Fear of unknown triggers or surprises",
    },
    {
      id: "safety_behaviors",
      label: "Without safety behaviors",
      description: "Avoid when I can’t bring someone or check my body",
    },
    {
      id: "exhaustion",
      label: "Feeling tired",
      description: "Avoiding because I might not cope with stress",
    },
    {
      id: "night_time",
      label: "Night time",
      description: "Being outside in the dark feels unsafe",
    },
  ];
  const symptomOptions: SeedItem[] = [
    {
      id: "racing_heart",
      label: "Racing heartbeat",
      description: "Fast or pounding heart feels dangerous",
    },
    {
      id: "shortness_breath",
      label: "Shortness of breath",
      description: "Feeling like I can’t get enough air",
    },
    {
      id: "dizziness",
      label: "Dizziness / lightheadedness",
      description: "Fear of fainting or losing balance",
    },
    {
      id: "chest_tightness",
      label: "Chest tightness",
      description: "Pressure or heaviness in the chest",
    },
    {
      id: "nausea",
      label: "Nausea",
      description: "Fear of vomiting or stomach upset",
    },
    {
      id: "tingling",
      label: "Tingling",
      description: "Pins and needles in face or hands",
    },
    {
      id: "sweating",
      label: "Sweating",
      description: "Fear of others noticing sweat",
    },
    {
      id: "hot_flush",
      label: "Hot flush",
      description: "Sudden warmth or blushing",
    },
    {
      id: "shaking",
      label: "Shaking",
      description: "Trembling or trembling hands",
    },
    {
      id: "blurred_vision",
      label: "Blurred vision",
      description: "Difficulty focusing, fear of collapse",
    },
    {
      id: "feeling_unreal",
      label: "Derealization / depersonalization",
      description: "Feeling detached or unreal",
    },
    {
      id: "cold_chills",
      label: "Cold chills",
      description: "Sudden cold or shivering sensations",
    },
  ];
  const stopReasonsOptions: SeedItem[] = [
    {
      id: "fear_symptoms",
      label: "Physical symptoms too strong",
      description:
        "Racing heart, dizziness, or chest tightness felt overwhelming",
    },
    {
      id: "fear_losing_control",
      label: "Fear of losing control",
      description: "Worried I might faint, go crazy, or embarrass myself",
    },
    {
      id: "embarrassment",
      label: "Embarrassment",
      description: "Felt people could see my anxiety or were judging me",
    },
    {
      id: "escape_urge",
      label: "Strong urge to escape",
      description: "Couldn’t resist the need to leave the situation",
    },
    {
      id: "safety_behavior",
      label: "Used a safety behavior",
      description:
        "Relied on phone, water, or checking body instead of staying",
    },
    {
      id: "panic_peak",
      label: "Panic peaked too high",
      description: "Fear level reached maximum and I couldn’t continue",
    },
    {
      id: "negative_thoughts",
      label: "Catastrophic thoughts",
      description: "Thought something bad was about to happen",
    },
    {
      id: "lack_confidence",
      label: "Lack of confidence",
      description: "Didn’t believe I could handle it this time",
    },
    {
      id: "tiredness",
      label: "Tired or unprepared",
      description: "Felt drained, not ready, or distracted",
    },
  ];
  const afterAttackActionsOptions: SeedItem[] = [
    {
      id: "called_ambulance",
      label: "Called ambulance/doctor",
      description: "I sought emergency help because it felt life-threatening",
    },
    {
      id: "went_home",
      label: "Went back home",
      description: "I returned home or to a safe place immediately",
    },
    {
      id: "left_event",
      label: "Left event early",
      description: "I left a meeting, party, or gathering before it ended",
    },
    {
      id: "canceled_plans",
      label: "Canceled future plans",
      description:
        "I avoided activities afterwards out of fear it could happen again",
    },
    {
      id: "rested_bed",
      label: "Lay down to rest",
      description: "I went to bed or lay down until I felt calmer",
    },
    {
      id: "googled_symptoms",
      label: "Googled symptoms",
      description: "I searched online to check if it was medical",
    },
    {
      id: "called_friend",
      label: "Called family/friend",
      description: "I reached out to someone for reassurance and comfort",
    },
    {
      id: "took_meds",
      label: "Took medication",
      description: "I used prescribed or over-the-counter medicine",
    },
    {
      id: "ate_drink",
      label: "Ate or drank something",
      description: "I used food or drink to feel grounded or safe",
    },
    {
      id: "avoided_trigger_place",
      label: "Avoided trigger place",
      description: "I decided not to return to where it happened",
    },
  ];
  const keptGoingReasonsOptions: SeedItem[] = [
    {
      id: "reminded_safe",
      label: "Reminded myself it’s safe",
      description: "I told myself panic is not dangerous",
    },
    {
      id: "trusted_it_passes",
      label: "Knew it would pass",
      description: "I trusted the wave would rise and fall",
    },
    {
      id: "wanted_progress",
      label: "Motivated by progress",
      description: "I wanted to prove to myself I could do it",
    },
    {
      id: "used_coping",
      label: "Used coping skills",
      description: "I practiced grounding or gentle breathing",
    },
    {
      id: "support_reminder",
      label: "Support reminder",
      description: "I remembered what my therapist/friend advised",
    },
    {
      id: "faith_trust",
      label: "Faith / spiritual trust",
      description: "I leaned on prayer, dhikr, or trust in Allah",
    },
    {
      id: "small_goal",
      label: "Set a small goal",
      description: "I decided to last just a little longer",
    },
    {
      id: "self_talk",
      label: "Positive self-talk",
      description: "I repeated calming words to myself",
    },
    {
      id: "noticed_drop",
      label: "Noticed fear drop",
      description: "I saw anxiety go down when I stayed",
    },
    {
      id: "future_benefit",
      label: "Thinking of the future",
      description: "I reminded myself this will help me long-term",
    },
  ];
  const skippedChallengeReasonsOptions: SeedItem[] = [
    {
      id: "too_anxious",
      label: "Too anxious beforehand",
      description: "I felt too nervous or panicky to even start",
    },
    {
      id: "did_not_feel_like",
      label: "Did not feel like it",
      description: "I wasn’t in the mood or lacked motivation",
    },
    {
      id: "tired_fatigue",
      label: "Tired or exhausted",
      description: "I didn’t have enough energy or felt drained",
    },
    {
      id: "busy_schedule",
      label: "Too busy",
      description: "I didn’t have time or was caught up in other tasks",
    },
    {
      id: "avoided_trigger",
      label: "Avoided the trigger",
      description: "I decided to stay away from the situation entirely",
    },
    {
      id: "negative_thoughts",
      label: "Negative expectations",
      description: "I convinced myself something bad would happen",
    },
    {
      id: "lack_support",
      label: "No support available",
      description: "I wanted someone with me but no one was free",
    },
    {
      id: "not_prepared",
      label: "Didn’t feel prepared",
      description: "I wasn’t ready mentally or didn’t plan it well",
    },
    {
      id: "low_priority",
      label: "Not a priority today",
      description: "I focused on other things and put it aside",
    },
    {
      id: "fear_failure",
      label: "Fear of failing",
      description: "I worried I wouldn’t succeed and avoided trying",
    },
  ];

  await upsertLocationOptions(locationOptions);
  await upsertChallengeOptions(challenges);

  await upsertTaxonomyItems("AVOIDANCE_REASON", avoidanceReasons);
  await upsertTaxonomyItems("SYMPTOM", symptomOptions);
  await upsertTaxonomyItems("STOP_REASON", stopReasonsOptions);
  await upsertTaxonomyItems("AFTER_ATTACK_ACTION", afterAttackActionsOptions);
  await upsertTaxonomyItems("KEPT_GOING_REASON", keptGoingReasonsOptions);
  await upsertTaxonomyItems(
    "SKIPPED_CHALLENGE_REASON",
    skippedChallengeReasonsOptions,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
