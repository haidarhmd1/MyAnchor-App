// prisma/seed.ts
import { PrismaClient, TaxonomyType, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

type SeedItem = {
  id: string;
  label: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
};

function mapDifficulty(d?: "easy" | "medium" | "hard"): Difficulty | undefined {
  if (!d) return undefined;
  if (d === "easy") return "EASY";
  if (d === "medium") return "MEDIUM";
  return "HARD";
}

async function upsertBatch(type: TaxonomyType, items: SeedItem[]) {
  for (const item of items) {
    await prisma.taxonomy.upsert({
      where: { slug: item.id },
      update: {
        type,
        label: item.label,
        description: item.description ?? null,
        difficulty: mapDifficulty(item.difficulty) ?? null,
      },
      create: {
        type,
        slug: item.id,
        label: item.label,
        description: item.description ?? null,
        difficulty: mapDifficulty(item.difficulty) ?? null,
      },
    });
  }
}

async function main() {
  // import your arrays here or paste them directly
  const locationOptions: SeedItem[] = [
    {
      id: "home",
      label: "Home",
      description: "At home / familiar place",
      difficulty: "easy",
    },
    {
      id: "outside",
      label: "Outside",
      description: "Street, park, small errands",
      difficulty: "medium",
    },
    {
      id: "work",
      label: "Work/School",
      description: "Tasks, meetings, classes",
      difficulty: "medium",
    },
    {
      id: "transport",
      label: "Transport",
      description: "Bus, train, car rides",
      difficulty: "hard",
    },
    {
      id: "crowd",
      label: "Crowd/Queue",
      description: "Busy shops, waiting in line",
      difficulty: "hard",
    },

    // Social & events
    {
      id: "event_birthday",
      label: "Birthday",
      description: "Attend a birthday gathering",
      difficulty: "medium",
    },
    {
      id: "event_company",
      label: "Company Event",
      description: "Work social, offsite, party",
      difficulty: "hard",
    },
    {
      id: "event_gathering",
      label: "Friends Gathering",
      description: "Small/medium social meetup",
      difficulty: "medium",
    },
    {
      id: "event_festival",
      label: "Festival/Concert",
      description: "Large crowd, loud music",
      difficulty: "hard",
    },

    // Travel specifics
    {
      id: "travel_airport",
      label: "Airport",
      description: "Check-in, security, gate",
      difficulty: "hard",
    },
    {
      id: "travel_flight",
      label: "Flight",
      description: "Short- or long-haul flight",
      difficulty: "hard",
    },
    {
      id: "transport_rideshare",
      label: "Ride Share/Taxi",
      description: "Uber/Taxi alone",
      difficulty: "medium",
    },

    // Everyday public places
    {
      id: "shopping_supermarket",
      label: "Supermarket",
      description: "Aisles, checkout line",
      difficulty: "medium",
    },
    {
      id: "mall",
      label: "Shopping Mall",
      description: "Enclosed, busy space",
      difficulty: "medium",
    },
    {
      id: "dining_restaurant",
      label: "Restaurant/Café",
      description: "Stay through full meal",
      difficulty: "medium",
    },
    {
      id: "cinema",
      label: "Cinema/Theater",
      description: "Sit through screening/show",
      difficulty: "medium",
    },
    {
      id: "gym",
      label: "Gym/Class",
      description: "Tolerate heartbeat sensations",
      difficulty: "medium",
    },
    {
      id: "religious_service",
      label: "Religious Service",
      description: "Stay for full service",
      difficulty: "medium",
    },

    // Performance/interaction
    {
      id: "presentation",
      label: "Presentation/Meeting",
      description: "Speak or stay present",
      difficulty: "hard",
    },
    {
      id: "interview",
      label: "Interview",
      description: "Job/School interview",
      difficulty: "hard",
    },
    {
      id: "phone_call",
      label: "Phone Call",
      description: "Make/receive & stay on call",
      difficulty: "easy",
    },
    {
      id: "video_call",
      label: "Video Call",
      description: "Camera on, stay engaged",
      difficulty: "medium",
    },

    // Movement & confined spaces
    {
      id: "elevator",
      label: "Elevator",
      description: "Ride and remain inside",
      difficulty: "medium",
    },
    {
      id: "bridge_tunnel",
      label: "Bridge/Tunnel",
      description: "Cross or drive through",
      difficulty: "hard",
    },
    {
      id: "highway_driving",
      label: "Highway Driving",
      description: "Sustained speed traffic",
      difficulty: "hard",
    },

    // Medical contexts
    {
      id: "medical_dentist",
      label: "Dentist",
      description: "Sit through appointment",
      difficulty: "hard",
    },
    {
      id: "medical_hospital",
      label: "Hospital/Clinic",
      description: "Waiting room, procedures",
      difficulty: "hard",
    },

    // Gentle starters
    {
      id: "night_walk",
      label: "Night Walk",
      description: "Short evening neighborhood walk",
      difficulty: "easy",
    },
  ];
  const challenges: SeedItem[] = [
    // Easy starters (low-level exposure)
    {
      id: "short_walk",
      label: "Short Walk",
      description: "5–10 min walk in the neighborhood",
      difficulty: "easy",
    },
    {
      id: "corner_shop",
      label: "Small Shop",
      description: "Enter a local store, buy 1 item",
      difficulty: "easy",
    },
    {
      id: "coffee_takeaway",
      label: "Coffee To-Go",
      description: "Order a takeaway drink and wait",
      difficulty: "easy",
    },
    {
      id: "friend_chat",
      label: "Brief Conversation",
      description: "Small talk with a friend or neighbor",
      difficulty: "easy",
    },

    // Medium challenges (moderate exposure)
    {
      id: "supermarket_quick",
      label: "Quick Supermarket Visit",
      description: "Stay in store for 5–10 min, use checkout",
      difficulty: "medium",
    },
    {
      id: "bus_one_stop",
      label: "Bus Ride (1 Stop)",
      description: "Ride one stop and remain seated",
      difficulty: "medium",
    },
    {
      id: "restaurant_meal",
      label: "Eat Out",
      description: "Sit down and finish a meal at a café",
      difficulty: "medium",
    },
    {
      id: "exercise_session",
      label: "Light Exercise",
      description: "Do 20 min workout, tolerate heart rate",
      difficulty: "medium",
    },
    {
      id: "social_small",
      label: "Small Gathering",
      description: "Spend 30–60 min with 2–3 people",
      difficulty: "medium",
    },

    // Harder exposures (stronger triggers)
    {
      id: "crowded_train",
      label: "Crowded Train/Bus",
      description: "Stay for several stops during rush hour",
      difficulty: "hard",
    },
    {
      id: "public_speaking",
      label: "Speak in Public",
      description: "Presentation, class, or group talk",
      difficulty: "hard",
    },
    {
      id: "mall_weekend",
      label: "Busy Mall",
      description: "Walk through mall at peak time",
      difficulty: "hard",
    },
    {
      id: "theater_movie",
      label: "Cinema/Theater",
      description: "Sit through full screening or event",
      difficulty: "hard",
    },
    {
      id: "airport_checkin",
      label: "Airport",
      description: "Go through security, wait at gate",
      difficulty: "hard",
    },
    {
      id: "flight_short",
      label: "Short Flight",
      description: "Domestic/short-haul flight",
      difficulty: "hard",
    },
    {
      id: "social_large",
      label: "Large Gathering",
      description: "Spend 30–60 min in a crowded place",
      difficulty: "hard",
    },

    // Medical contexts (often high anxiety)
    {
      id: "doctor_waiting",
      label: "Doctor Appointment",
      description: "Wait calmly in clinic room",
      difficulty: "medium",
    },
    {
      id: "dentist_chair",
      label: "Dentist",
      description: "Sit through routine checkup",
      difficulty: "hard",
    },

    // Social performance
    {
      id: "video_meeting",
      label: "Video Call",
      description: "Stay engaged with camera on",
      difficulty: "medium",
    },
    {
      id: "phone_call_stranger",
      label: "Phone Call",
      description: "Call a stranger (e.g., book appointment)",
      difficulty: "medium",
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

  await upsertBatch("LOCATION", locationOptions);
  await upsertBatch("CHALLENGE", challenges);
  await upsertBatch("AVOIDANCE_REASON", avoidanceReasons);
  await upsertBatch("SYMPTOM", symptomOptions);
  await upsertBatch("STOP_REASON", stopReasonsOptions);
  await upsertBatch("AFTER_ATTACK_ACTION", afterAttackActionsOptions);
  await upsertBatch("KEPT_GOING_REASON", keptGoingReasonsOptions);
  await upsertBatch("SKIPPED_CHALLENGE_REASON", skippedChallengeReasonsOptions);
}

main().finally(() => prisma.$disconnect());
