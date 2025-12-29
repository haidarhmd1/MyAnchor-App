import { StaticImageData } from "next/image";

export type Source = { id: string; url: string };

export type Paragraph = {
  id: string;
  textKey: string;
};

type Article = {
  titleKey: string;
  subtitleKey: string;
  content: Paragraph[];
  sources: Source[];
};

// Psy education
export const understandingAnxiety: Article = {
  titleKey: "education.understandingAnxiety.title",
  subtitleKey: "education.understandingAnxiety.subtitle",
  content: [
    {
      id: "a5a4c4ea-7bb9-4d67-aeb9-5b90a4f5b0b1",
      textKey: "education.understandingAnxiety.p1",
    },
    {
      id: "8c94d416-9319-4d66-a586-60ac3aee5576",
      textKey: "education.understandingAnxiety.p2",
    },
    {
      id: "3473d63d-8ef9-4a4a-b7b3-d177735c471d",
      textKey: "education.understandingAnxiety.p3",
    },
    {
      id: "9f681b3e-7755-41f5-96d1-93289ec35655",
      textKey: "education.understandingAnxiety.p4",
    },
    {
      id: "27f8d3ab-fd0d-4719-b93a-d1af2f9a8f5e",
      textKey: "education.understandingAnxiety.p5",
    },
  ],
  sources: [],
};

export const panicDisorderExplained: Article = {
  titleKey: "education.panicDisorderExplained.title",
  subtitleKey: "education.panicDisorderExplained.subtitle",
  content: [
    {
      id: "a3b85b4a-b463-4693-84f4-3b8d2eb9a9b0",
      textKey: "education.panicDisorderExplained.p1",
    },
    {
      id: "b8dfe3fb-8d53-4a9a-9c4f-00395f24e1dd",
      textKey: "education.panicDisorderExplained.p2",
    },
    {
      id: "e5e03b70-b8a5-4f15-9209-7f7eeb13d651",
      textKey: "education.panicDisorderExplained.p3",
    },
    {
      id: "7fa3319d-f988-48f1-8d9b-cc0a36e79da4",
      textKey: "education.panicDisorderExplained.p4",
    },
    {
      id: "2e2d56c6-32f5-4d28-92f2-dcfa418c8b7f",
      textKey: "education.panicDisorderExplained.p5",
    },
  ],
  sources: [],
};

export const findYourWayOut: Article = {
  titleKey: "education.findYourWayOut.title",
  subtitleKey: "education.findYourWayOut.subtitle",
  content: [
    {
      id: "29f1861e-6b72-4a0f-9bb7-9cbbe5d29b14",
      textKey: "education.findYourWayOut.p1",
    },
    {
      id: "3c7f7399-5f37-418f-9dd1-cfb46267402a",
      textKey: "education.findYourWayOut.p2",
    },
    {
      id: "48f51dcb-95f0-4c11-91f4-f1db27cb599f",
      textKey: "education.findYourWayOut.p3",
    },
    {
      id: "b3534f89-08aa-4a4f-b17e-83b6dfc1d1a1",
      textKey: "education.findYourWayOut.p4",
    },
    {
      id: "ad91a5c0-72b4-44d8-8c62-21d872fb924d",
      textKey: "education.findYourWayOut.p5",
    },
  ],
  sources: [
    {
      id: "fcf318f3-4d08-4db4-b8e7-9a847436fb6a",
      url: "https://www.nice.org.uk/guidance/cg113",
    },
    {
      id: "7b3f19f7-2891-4088-bf2d-2c597a31336c",
      url: "https://www.aafp.org/pubs/afp/issues/2022/0800/generalized-anxiety-disorder-panic-disorder.html",
    },
    {
      id: "1cc47fbf-2c43-4b25-b7a5-314f87fbc272",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4114726/?utm_source",
    },
    {
      id: "6c9a0c3b-7c7d-43fb-bd07-49f219e9c3b0",
      url: "https://pubmed.ncbi.nlm.nih.gov/24864005/",
    },
    {
      id: "32704c88-befc-4ee5-a0a4-1a0b0e492b73",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0005796718301955",
    },
    {
      id: "21eaa3a3-c7e5-4e45-9019-e8b1f7bde066",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11900950",
    },
    {
      id: "a3b0461e-37e6-41e7-9bde-d79c1df5c2bb",
      url: "https://www.colorado.edu/clinicalpsychology/sites/default/files/attached-files/inhibitory_learning_for_ocd_jocrd_special_issue_arch_abramowitz_6_12_14.pdf",
    },
    {
      id: "6d92782d-76f0-40de-a8f0-09c20ff3caaa",
      url: "https://www.sciencedirect.com/science/article/abs/pii/000579679190121I",
    },
    {
      id: "9d97c41b-5d8c-48cb-98c7-63dbd05521f6",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9954474/",
    },
    {
      id: "d4997605-cf47-41a4-8208-3b6f92e51e38",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S1077722924001007",
    },
  ],
};

export const theCurveOfPanic: Article = {
  titleKey: "education.theCurveOfPanic.title",
  subtitleKey: "education.theCurveOfPanic.subtitle",
  content: [
    {
      id: "e3aa3e41-55c1-4d69-bab3-146fc2441f77",
      textKey: "education.theCurveOfPanic.p1",
    },
    {
      id: "6c12fd0c-31e6-4edc-b57e-fac81ad6a3b5",
      textKey: "education.theCurveOfPanic.p2",
    },
    {
      id: "3fc6dd34-45d4-4634-bf14-65f7a9b2f3e8",
      textKey: "education.theCurveOfPanic.p3",
    },
    {
      id: "97b82e60-6f22-4c8a-8e77-7126eb544a44",
      textKey: "education.theCurveOfPanic.p4",
    },
  ],
  sources: [],
};

export const rewireEffect: Article = {
  titleKey: "education.rewireEffect.title",
  subtitleKey: "education.rewireEffect.subtitle",
  content: [
    {
      id: "2d0b356f-15fd-4941-93d6-31a65cc2554b",
      textKey: "education.rewireEffect.p1",
    },
    {
      id: "24c7060b-700f-47e1-888c-dfe04f4e1ed2",
      textKey: "education.rewireEffect.p2",
    },
    {
      id: "f52f6d89-c81d-4202-9109-fb873b495b94",
      textKey: "education.rewireEffect.p3",
    },
    {
      id: "27de43c1-1abf-414a-b7f8-9df83c0f9269",
      textKey: "education.rewireEffect.p4",
    },
    {
      id: "ea0fc6f1-7c7f-4cf0-9775-4204b7e4f47e",
      textKey: "education.rewireEffect.p5",
    },
    {
      id: "30b986c4-b4fd-47a2-830a-6fcd03fbc0ec",
      textKey: "education.rewireEffect.p6",
    },
  ],
  sources: [],
};

export const whyAllowingPanicHelps: Article = {
  titleKey: "education.whyAllowingPanicHelps.title",
  subtitleKey: "education.whyAllowingPanicHelps.subtitle",
  content: [
    {
      id: "8a48b39a-4f4a-4ad5-9b63-0dd65e75a3b2",
      textKey: "education.whyAllowingPanicHelps.p1",
    },
    {
      id: "4cc91677-f2f7-4a35-86c2-42ed9f7a7a65",
      textKey: "education.whyAllowingPanicHelps.p2",
    },
    {
      id: "2bca6d76-d25e-4748-9a07-ff2adcb5abfa",
      textKey: "education.whyAllowingPanicHelps.p3",
    },
  ],
  sources: [],
};

export const whyThisFeelsHardAtFirst: Article = {
  titleKey: "education.whyThisFeelsHardAtFirst.title",
  subtitleKey: "education.whyThisFeelsHardAtFirst.subtitle",
  content: [
    {
      id: "a86f5b84-64b2-4ee0-9e65-6a08c14b00e5",
      textKey: "education.whyThisFeelsHardAtFirst.p1",
    },
  ],
  sources: [],
};

export const exercisesInteroceptiveContent: Article = {
  titleKey: "education.exercisesInteroceptiveContent.title",
  subtitleKey: "education.exercisesInteroceptiveContent.subtitle",
  content: [
    {
      id: "d219013f-fd0c-4c0c-9a51-340d07420b73",
      textKey: "education.exercisesInteroceptiveContent.p1",
    },
  ],
  sources: [],
};

// Guide steps (keep IDs, use key paths that match the JSON)
export type InteroceptiveGuideStep = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  content: { id: string; textKey: string }[];
};

export const interoceptiveExposureGuide: InteroceptiveGuideStep[] = [
  {
    id: "c9ad20e0-7a3a-48f8-9e2d-bdc843afc6cd",
    titleKey: "education.interoceptiveExposureGuide.step1.title",
    descriptionKey: "education.interoceptiveExposureGuide.step1.description",
    content: [
      {
        id: "25f7f562-028a-468e-8296-1e07f22f2d88",
        textKey: "education.interoceptiveExposureGuide.step1.p1",
      },
      {
        id: "b9cd3206-ec69-4e7c-85f6-379d9ecdb22f",
        textKey: "education.interoceptiveExposureGuide.step1.p2",
      },
      {
        id: "6bb9ec7e-1d4d-44ec-9e26-dc059a3a6a02",
        textKey: "education.interoceptiveExposureGuide.step1.p3",
      },
    ],
  },
  {
    id: "ef0f99c0-77b4-4a52-b2f0-1e2b09e2dc11",
    titleKey: "education.interoceptiveExposureGuide.step2.title",
    descriptionKey: "education.interoceptiveExposureGuide.step2.description",
    content: [
      {
        id: "8dfeebc9-7aa3-4184-96c7-d781fe74b6c3",
        textKey: "education.interoceptiveExposureGuide.step2.p1",
      },
      {
        id: "06f39e0a-3021-4405-89c6-0bb22b8aeb84",
        textKey: "education.interoceptiveExposureGuide.step2.p2",
      },
      {
        id: "54aee312-9dcb-4ac0-a0b9-839089b3d07a",
        textKey: "education.interoceptiveExposureGuide.step2.p3",
      },
      {
        id: "a0451d26-5f68-41c0-87c6-15679c26b8ae",
        textKey: "education.interoceptiveExposureGuide.step2.p4",
      },
      {
        id: "7b07c74a-3d4e-4854-872d-55772616971e",
        textKey: "education.interoceptiveExposureGuide.step2.p5",
      },
    ],
  },
  {
    id: "9e9f21cf-0c70-4208-bc8e-0d1b47b7e69e",
    titleKey: "education.interoceptiveExposureGuide.step3.title",
    descriptionKey: "education.interoceptiveExposureGuide.step3.description",
    content: [
      {
        id: "7aafed4f-6bc4-47b2-bb97-f72ed988b7e7",
        textKey: "education.interoceptiveExposureGuide.step3.p1",
      },
      {
        id: "272539c3-9b30-4458-9f7b-3520f2a3c4a6",
        textKey: "education.interoceptiveExposureGuide.step3.p2",
      },
    ],
  },
  {
    id: "2d8a0f46-74c0-4c7f-a822-995548a2cda1",
    titleKey: "education.interoceptiveExposureGuide.step4.title",
    descriptionKey: "education.interoceptiveExposureGuide.step4.description",
    content: [
      {
        id: "8c021c8f-4e7b-4c0c-b2ee-7d2c963c2b4a",
        textKey: "education.interoceptiveExposureGuide.step4.p1",
      },
      {
        id: "e52d4c2c-d6f6-402c-88ae-1b4620a9e38c",
        textKey: "education.interoceptiveExposureGuide.step4.p2",
      },
    ],
  },
  {
    id: "9cc1ee3d-64d1-4a28-8416-4c785a0233e4",
    titleKey: "education.interoceptiveExposureGuide.step5.title",
    descriptionKey: "education.interoceptiveExposureGuide.step5.description",
    content: [
      {
        id: "94320a2d-19a0-4f94-8f2f-351bbbd847e6",
        textKey: "education.interoceptiveExposureGuide.step5.p1",
      },
      {
        id: "e32e2d2c-7d3c-4d3a-8f1b-15d39c56dfae",
        textKey: "education.interoceptiveExposureGuide.step5.p2",
      },
      {
        id: "8b7d8729-4b5f-490d-823a-85f7c6cf54ec",
        textKey: "education.interoceptiveExposureGuide.step5.p3",
      },
    ],
  },
  {
    id: "f4b5e2f6-7ef9-4038-8b3d-3c6a0538ad9a",
    titleKey: "education.interoceptiveExposureGuide.step6.title",
    descriptionKey: "education.interoceptiveExposureGuide.step6.description",
    content: [
      {
        id: "a0b7cf10-b4d3-4a69-b1b3-3bb1a67f4f8e",
        textKey: "education.interoceptiveExposureGuide.step6.p1",
      },
      {
        id: "3c6a9c85-8d18-4e86-bd56-d6d32c47b23a",
        textKey: "education.interoceptiveExposureGuide.step6.p2",
      },
      {
        id: "d8d3d7fc-8e92-4ed4-9d4e-0efc9fbe986d",
        textKey: "education.interoceptiveExposureGuide.step6.p3",
      },
    ],
  },
  {
    id: "91c8ad39-b0c7-4e8c-9c70-2581d8f59a2c",
    titleKey: "education.interoceptiveExposureGuide.step7.title",
    descriptionKey: "education.interoceptiveExposureGuide.step7.description",
    content: [
      {
        id: "5f4e9e8e-1727-476d-9df6-1cdbf20a2c7d",
        textKey: "education.interoceptiveExposureGuide.step7.p1",
      },
      {
        id: "fc23b1ef-7b48-42a3-9c85-2ea6209ddc02",
        textKey: "education.interoceptiveExposureGuide.step7.p2",
      },
    ],
  },
];

export type Exercise = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  contentKey: string;
  duration: number;
  imgSrc: string | StaticImageData;
};

export const exerciseList: Exercise[] = [
  {
    id: "f35b7c02-2981-44ad-9eeb-13fa9ec72b5c",
    titleKey: "education.exerciseList.lightDizziness.title",
    descriptionKey: "education.exerciseList.lightDizziness.description",
    contentKey: "education.exerciseList.lightDizziness.content",
    duration: 15,
    imgSrc: "/illustration/exercises/light-dizziness.png",
  },
  {
    id: "0c74a84c-aba8-4b71-9542-18a96ff72e3a",
    titleKey: "education.exerciseList.shortnessOfBreath.title",
    descriptionKey: "education.exerciseList.shortnessOfBreath.description",
    contentKey: "education.exerciseList.shortnessOfBreath.content",
    duration: 30,
    imgSrc: "/illustration/exercises/shortness-of-breath.png",
  },
  {
    id: "5a8e5d7b-4e06-4859-87b6-d1c772d4de40",
    titleKey: "education.exerciseList.racingHeart.title",
    descriptionKey: "education.exerciseList.racingHeart.description",
    contentKey: "education.exerciseList.racingHeart.content",
    duration: 45,
    imgSrc: "/illustration/exercises/racing-heartbeat.png",
  },
  {
    id: "b16a4b28-1a04-4bb6-a5c1-3a1e4411e2db",
    titleKey: "education.exerciseList.heavyBreathing.title",
    descriptionKey: "education.exerciseList.heavyBreathing.description",
    contentKey: "education.exerciseList.heavyBreathing.content",
    duration: 30,
    imgSrc: "/illustration/exercises/heavy-breathing.png",
  },
  {
    id: "b6e3211d-d4d7-4eb1-844a-6c76b6c7f18c",
    titleKey: "education.exerciseList.warmFlush.title",
    descriptionKey: "education.exerciseList.warmFlush.description",
    contentKey: "education.exerciseList.warmFlush.content",
    duration: 15,
    imgSrc: "/illustration/exercises/warm-flush.png",
  },
];
