import { StaticImageData } from "next/image";
import {
  findYourWayOut,
  panicDisorderExplained,
  rewireEffect,
  theCurveOfPanic,
  understandingAnxiety,
} from "./content";

type ContentItem = {
  id: string;
  text: string;
};

type URLItem = {
  id: string;
  url: string;
};

export const education: {
  id: string;
  title: string;
  description: string;
  link: string;
  imgSrc: string | StaticImageData;
  slug: string;
  content: {
    title: string;
    subtitle: string;
    content: ContentItem[];
    sources: URLItem[] | [];
  };
}[] = [
  {
    id: "7bf613f7-e7d2-44fa-8dec-55cde37e8c5a",
    title: "Understanding Anxiety",
    description:
      "Learn about the nature of anxiety and its impact on your life.",
    link: "education/understanding-anxiety",
    imgSrc: "/illustration/education/u-anxiety.png",
    slug: "understanding-anxiety",
    content: understandingAnxiety,
  },
  {
    id: "b007ac64-a246-472f-bd64-06e3c7488af8",
    title: "Panic Disorder Explained",
    description: "Explore the causes and symptoms of panic disorder.",
    link: "education/panic-disorder-explained",
    imgSrc: "/illustration/education/panic-d-explained.png",
    slug: "panic-disorder-explained",
    content: panicDisorderExplained,
  },
  {
    id: "72703978-c8ca-4d8c-a2eb-c43d9473724a",
    title: "What maintains anxiety",
    // description:
    //   "Discover effective strategies for managing anxiety and panic.",
    description: "The curve of panic",
    link: "education/what-maintains-anxiety",
    imgSrc: "/illustration/education/what-maintains-anxiety.png",
    slug: "what-maintains-anxiety",
    content: theCurveOfPanic,
  },
  {
    id: "0e03bd68-df94-4a3a-9ee3-c955293c98dd",
    title: "Find your way out",
    description: "Explore and learn what you can do.",
    link: "education/find-your-way-out",
    imgSrc: "/illustration/education/healing.png",
    slug: "find-your-way-out",
    content: findYourWayOut,
  },
  {
    id: "b29f45fe-b76f-47af-848f-50e65a0fa943",
    title: "Rewire Effect",
    description: "How to rewire your brain",
    link: "education/rewire-effect",
    imgSrc: "/illustration/education/rewire-effect.png",
    slug: "rewire-effect",
    content: rewireEffect,
  },
];

export const categories: {
  id: string;
  title: string;
  description: string;
  link: string;
  imgSrc: string | StaticImageData;
  slug: string;
}[] = [
  {
    id: "767859eb-303f-4f05-a158-f9d41fa19f9a",
    title: "Psycho-education",
    description: "Learn and understand your anxiety and panic disorders",
    imgSrc: "/illustration/psycho-education.png",
    link: "/education",
    slug: "education",
  },
  {
    id: "78d869da-2632-4d0e-9329-9e161bb38696",
    title: "Trigger Exercises",
    description:
      "Confront your triggers using interoceptive exposure exercises",
    imgSrc: "/illustration/exercises.png",
    link: "/exercises",
    slug: "exercises",
  },
  {
    id: "0b86e632-447a-487b-90b6-bb5dc312cde6",
    title: "Exposure Tracker",
    description: "Confront your triggers and become urself again",
    imgSrc: "/illustration/psycho-education.png",
    link: "/exposure",
    slug: "exposure",
  },
];
