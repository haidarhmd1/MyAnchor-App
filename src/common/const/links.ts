import { StaticImageData } from "next/image";
import {
  findYourWayOut,
  panicDisorderExplained,
  Paragraph,
  rewireEffect,
  Source,
  theCurveOfPanic,
  understandingAnxiety,
} from "./content";

type EducationItem = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  link: string;
  imgSrc: string | StaticImageData;
  slug: string;
  content: {
    titleKey: string;
    subtitleKey: string;
    content: Paragraph[];
    sources: Source[];
  };
};

export const education: EducationItem[] = [
  {
    id: "7bf613f7-e7d2-44fa-8dec-55cde37e8c5a",
    titleKey: "educationIndex.items.understandingAnxiety.title",
    descriptionKey: "educationIndex.items.understandingAnxiety.description",
    link: "education/understanding-anxiety",
    imgSrc: "/illustration/education/u-anxiety.png",
    slug: "understanding-anxiety",
    content: understandingAnxiety,
  },
  {
    id: "b007ac64-a246-472f-bd64-06e3c7488af8",
    titleKey: "educationIndex.items.panicDisorderExplained.title",
    descriptionKey: "educationIndex.items.panicDisorderExplained.description",
    link: "education/panic-disorder-explained",
    imgSrc: "/illustration/education/panic-d-explained.png",
    slug: "panic-disorder-explained",
    content: panicDisorderExplained,
  },
  {
    id: "72703978-c8ca-4d8c-a2eb-c43d9473724a",
    titleKey: "educationIndex.items.whatMaintainsAnxiety.title",
    descriptionKey: "educationIndex.items.whatMaintainsAnxiety.description",
    link: "education/what-maintains-anxiety",
    imgSrc: "/illustration/education/what-maintains-anxiety.png",
    slug: "what-maintains-anxiety",
    content: theCurveOfPanic,
  },
  {
    id: "0e03bd68-df94-4a3a-9ee3-c955293c98dd",
    titleKey: "educationIndex.items.findYourWayOut.title",
    descriptionKey: "educationIndex.items.findYourWayOut.description",
    link: "education/find-your-way-out",
    imgSrc: "/illustration/education/healing.png",
    slug: "find-your-way-out",
    content: findYourWayOut,
  },
  {
    id: "b29f45fe-b76f-47af-848f-50e65a0fa943",
    titleKey: "educationIndex.items.rewireEffect.title",
    descriptionKey: "educationIndex.items.rewireEffect.description",
    link: "education/rewire-effect",
    imgSrc: "/illustration/education/rewire-effect.png",
    slug: "rewire-effect",
    content: rewireEffect,
  },
];

type Category = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  link: string;
  gradient: { from: string; to: string };
  imgSrc: string | StaticImageData;
  slug: string;
};

export const categories: Category[] = [
  {
    id: "767859eb-303f-4f05-a158-f9d41fa19f9a",
    titleKey: "educationIndex.categories.education.title",
    descriptionKey: "educationIndex.categories.education.description",
    imgSrc: "/illustration/psycho-education.png",
    link: "/education",
    slug: "education",
    // gradient: {
    //   from: "from-sky-100/60",
    //   to: "to-sky-200/30",
    // },
    gradient: {
      from: "from-white",
      to: "to-white",
    },
  },
  {
    id: "78d869da-2632-4d0e-9329-9e161bb38696",
    titleKey: "educationIndex.categories.exercises.title",
    descriptionKey: "educationIndex.categories.exercises.description",
    imgSrc: "/illustration/exercises.png",
    link: "/exercises",
    slug: "exercises",
    // gradient: {
    //   from: "from-indigo-100/60",
    //   to: "to-indigo-200/30",
    // },
    gradient: {
      from: "from-white",
      to: "to-white",
    },
  },
  {
    id: "0b86e632-447a-487b-90b6-bb5dc312cde6",
    titleKey: "educationIndex.categories.exposure.title",
    descriptionKey: "educationIndex.categories.exposure.description",
    imgSrc: "/illustration/psycho-education.png",
    link: "/exposure",
    slug: "exposure",
    // gradient: {
    //   from: "from-violet-100/60",
    //   to: "to-violet-200/30",
    // },
    gradient: {
      from: "from-white",
      to: "to-white",
    },
  },
];
