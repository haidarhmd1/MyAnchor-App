import { AnxietySupportRequest } from "./types";

type Symptom = AnxietySupportRequest["symptoms"][number];
type Location = AnxietySupportRequest["location"];

export const SYMPTOM_CONTEXT: Record<
  Symptom,
  {
    mechanism: string;
    common_catastrophic_meaning: string;
  }
> = {
  racing_heart: {
    mechanism:
      "A racing heartbeat can happen when adrenaline activates the body's threat system.",
    common_catastrophic_meaning: "Something is wrong with my heart.",
  },
  shortness_of_breath: {
    mechanism:
      "Shortness of breath can happen when anxiety changes breathing rhythm, creates overbreathing, or tightens the chest wall.",
    common_catastrophic_meaning: "I am not getting enough air.",
  },
  dizziness: {
    mechanism:
      "Lightheadedness can happen during anxiety when breathing changes, muscles tense, and the body becomes overstimulated.",
    common_catastrophic_meaning: "I am about to collapse.",
  },
  chest_tightness: {
    mechanism:
      "Chest tightness can happen with muscle tension, chest wall activation, and alarm-driven breathing changes.",
    common_catastrophic_meaning: "This means something is seriously wrong.",
  },
  nausea: {
    mechanism:
      "Nausea can happen because the stress response shifts energy away from digestion.",
    common_catastrophic_meaning: "I am losing control of my body.",
  },
  tingling: {
    mechanism:
      "Tingling can happen during anxiety, especially when breathing becomes too fast or shallow.",
    common_catastrophic_meaning: "Something neurological is happening.",
  },
  sweating: {
    mechanism:
      "Sweating is a common part of autonomic arousal when the body moves into high alert.",
    common_catastrophic_meaning: "Everyone can see I am falling apart.",
  },
  hot_flush: {
    mechanism:
      "A hot flush can happen when stress hormones alter temperature perception and blood flow.",
    common_catastrophic_meaning: "My body is going out of control.",
  },
  shaking: {
    mechanism:
      "Shaking can happen when adrenaline activates the muscles during anxiety.",
    common_catastrophic_meaning: "I am about to lose control.",
  },
  blurred_vision: {
    mechanism:
      "Blurred vision can happen during overload, tension, and dysregulated breathing.",
    common_catastrophic_meaning: "I am about to pass out.",
  },
  derealization_depersonalization: {
    mechanism:
      "Derealization or depersonalization can happen during overwhelm as a protective stress response.",
    common_catastrophic_meaning: "I am going crazy or losing my mind.",
  },
  cold_chills: {
    mechanism:
      "Cold chills can happen during autonomic activation and rapid shifts in arousal.",
    common_catastrophic_meaning: "Something is seriously wrong with my body.",
  },
};

export const LOCATION_CONTEXT: Record<
  Location,
  {
    guidance: string;
    likely_trigger: string;
  }
> = {
  gym: {
    guidance:
      "Distinguish exercise sensations from panic amplification. Pause, stabilize, and assess before resuming.",
    likely_trigger:
      "Physical exertion can blend with anxiety sensations and make the alarm response escalate.",
  },
  work: {
    guidance:
      "Use discreet grounding, a brief reset, and reduce performance urgency.",
    likely_trigger:
      "Pressure, attention, deadlines, and fear of not coping visibly can intensify symptoms.",
  },
  cafe: {
    guidance:
      "Reduce sensory overload, anchor visually, and allow a quiet pause without rushing.",
    likely_trigger:
      "Noise, stimulation, and public visibility can increase self-monitoring and arousal.",
  },
  transport: {
    guidance:
      "Use seat or floor anchors, think in short time horizons, and address the trapped feeling directly.",
    likely_trigger:
      "Feeling unable to leave immediately can amplify panic and body scanning.",
  },
  home: {
    guidance:
      "Settle the nervous system without reinforcing the idea that home is the only safe place.",
    likely_trigger:
      "At home, the struggle can become more internal, with more room for checking and rumination.",
  },
  social_gathering: {
    guidance:
      "Normalize overstimulation, step out briefly if needed, and reduce self-monitoring.",
    likely_trigger:
      "Crowds, noise, social evaluation, and overstimulation can intensify body alarm signals.",
  },
};
