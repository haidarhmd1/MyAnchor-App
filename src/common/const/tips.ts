export type TipContentItem = {
  id: string;
  titleKey: string;
  textKey: string;
};

export type Tip = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imgSrc: string;
  slug: string;
  content: TipContentItem[];
};

export const tips: Tip[] = [
  {
    id: "71779AE1-DFAF-4B4D-8034-4B702C3AF65E",
    titleKey: "tips.items.9WaysToCalm.title",
    descriptionKey: "tips.items.9WaysToCalm.description",
    imgSrc: "/illustration/tip_1.png",
    slug: "9-ways-to-calm-yourself-during-a-panic-attack",
    content: [
      {
        id: "68BC6D73-BD7C-4E03-B12C-A84E48FA40E3",
        titleKey: "tips.items.9WaysToCalm.content.remind.title",
        textKey: "tips.items.9WaysToCalm.content.remind.text",
      },
      {
        id: "1994CBBB-6703-446C-A43D-354AB9C59B67",
        titleKey: "tips.items.9WaysToCalm.content.stay.title",
        textKey: "tips.items.9WaysToCalm.content.stay.text",
      },
      {
        id: "DAE20422-3E4B-46B3-92EF-0D031C260F42",
        titleKey: "tips.items.9WaysToCalm.content.allow.title",
        textKey: "tips.items.9WaysToCalm.content.allow.text",
      },
      {
        id: "DC4643DF-3627-4B35-9406-E2C3B270F718",
        titleKey: "tips.items.9WaysToCalm.content.wave.title",
        textKey: "tips.items.9WaysToCalm.content.wave.text",
      },
      {
        id: "36FBD580-A900-4FE1-A7F9-149DDD106566",
        titleKey: "tips.items.9WaysToCalm.content.breathing.title",
        textKey: "tips.items.9WaysToCalm.content.breathing.text",
      },
      {
        id: "DCE19698-664D-4969-819A-B84EBC1E6971",
        titleKey: "tips.items.9WaysToCalm.content.ground.title",
        textKey: "tips.items.9WaysToCalm.content.ground.text",
      },
      {
        id: "069E29DC-9A6B-4B22-A16B-07D180CC377D",
        titleKey: "tips.items.9WaysToCalm.content.dropSafety.title",
        textKey: "tips.items.9WaysToCalm.content.dropSafety.text",
      },
      {
        id: "62C4A71C-FAD3-4AA4-9FD1-4AC2C25FEF4E",
        titleKey: "tips.items.9WaysToCalm.content.selfTalk.title",
        textKey: "tips.items.9WaysToCalm.content.selfTalk.text",
      },
      {
        id: "8C8EFC80-628D-4D6E-A0E9-C251723E4473",
        titleKey: "tips.items.9WaysToCalm.content.wait.title",
        textKey: "tips.items.9WaysToCalm.content.wait.text",
      },
    ],
  },

  {
    id: "EC572840-9036-4934-9701-5A5BCAA65718",
    titleKey: "tips.items.typesOfAnxiety.title",
    descriptionKey: "tips.items.typesOfAnxiety.description",
    imgSrc: "/illustration/different-types-of-anxiety.png",
    slug: "understanding-the-different-types-of-anxiety",
    content: [
      {
        id: "50EC0F9E-B1C4-45B8-B077-7A9ECFEEB152",
        titleKey: "tips.items.typesOfAnxiety.content.panicDisorder.title",
        textKey: "tips.items.typesOfAnxiety.content.panicDisorder.text",
      },
      {
        id: "1DA053CA-CC93-48C5-9A14-E2F2713CCE9F",
        titleKey: "tips.items.typesOfAnxiety.content.gad.title",
        textKey: "tips.items.typesOfAnxiety.content.gad.text",
      },
      {
        id: "CC3CCFAA-249B-478A-89CF-8A9BDE2B5FF6",
        titleKey: "tips.items.typesOfAnxiety.content.socialAnxiety.title",
        textKey: "tips.items.typesOfAnxiety.content.socialAnxiety.text",
      },
      {
        id: "CF3FCAC9-7958-4F94-BE22-BB6529BFB3B1",
        titleKey: "tips.items.typesOfAnxiety.content.phobias.title",
        textKey: "tips.items.typesOfAnxiety.content.phobias.text",
      },
      {
        id: "B4993A9B-06D1-4CAD-9BCC-617E248DF6F8",
        titleKey: "tips.items.typesOfAnxiety.content.agoraphobia.title",
        textKey: "tips.items.typesOfAnxiety.content.agoraphobia.text",
      },
      {
        id: "0E1152AA-3FA9-46A2-8FED-13A4CAE3E45D",
        titleKey: "tips.items.typesOfAnxiety.content.separationAnxiety.title",
        textKey: "tips.items.typesOfAnxiety.content.separationAnxiety.text",
      },
      {
        id: "7B70D8CE-6A2C-42C1-AFCD-14CD4E9E9225",
        titleKey: "tips.items.typesOfAnxiety.content.ptsd.title",
        textKey: "tips.items.typesOfAnxiety.content.ptsd.text",
      },
      {
        id: "91B3D4FD-7DFB-4334-AFBC-E0AE602D5A70",
        titleKey: "tips.items.typesOfAnxiety.content.ocd.title",
        textKey: "tips.items.typesOfAnxiety.content.ocd.text",
      },
    ],
  },

  {
    id: "21B91FFE-1EF8-4293-8FA9-167D6E05CD9A",
    titleKey: "tips.items.commonSymptoms.title",
    descriptionKey: "tips.items.commonSymptoms.description",
    imgSrc: "/illustration/exercises/racing-heartbeat.png",
    slug: "common-symptoms-of-anxiety-and-panic",
    content: [
      {
        id: "EC043C97-3373-41F5-B5C5-0F81F6C1B6A1",
        titleKey: "tips.items.commonSymptoms.content.mental.title",
        textKey: "tips.items.commonSymptoms.content.mental.text",
      },
      {
        id: "557FFEA9-E1F5-4FB9-B535-4C67DA666830",
        titleKey: "tips.items.commonSymptoms.content.physical.title",
        textKey: "tips.items.commonSymptoms.content.physical.text",
      },
      {
        id: "6C224750-336C-4FFB-BEE8-AA564C9E6EDA",
        titleKey: "tips.items.commonSymptoms.content.panicSpecific.title",
        textKey: "tips.items.commonSymptoms.content.panicSpecific.text",
      },
      {
        id: "1DE89477-7211-4907-A19B-5CC12AEA3AAE",
        titleKey: "tips.items.commonSymptoms.content.important.title",
        textKey: "tips.items.commonSymptoms.content.important.text",
      },
    ],
  },
];
