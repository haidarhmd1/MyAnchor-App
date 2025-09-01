import { tips } from "@/common/const/tips";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Tip({ params }: Props) {
  const { slug } = await params;

  const matchedSlug = tips.find((t) => t.slug === slug);

  if (!matchedSlug) return notFound();

  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("${matchedSlug.imgSrc}")`,
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">{matchedSlug.title}</h5>
        <h2 className="text-2xl">{matchedSlug.description}</h2>
        {matchedSlug.content.map((content) => (
          <p key={content.id} className="mt-4 text-lg">
            {content.text}
          </p>
        ))}
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const matchedSlug = tips.find((t) => t.slug === slug);
  if (!matchedSlug) return notFound();

  return {
    title: `⚓ MyAnchor - Tips - ${matchedSlug.title}`,
  };
}
