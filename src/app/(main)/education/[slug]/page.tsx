import { education } from "@/const/links";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const matchSlugEducation = education.find((e) => e.slug === slug);
  if (!matchSlugEducation) return notFound();

  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(${matchSlugEducation.imgSrc})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">{matchSlugEducation.content.title}</h5>
        <h2 className="text-2xl">{matchSlugEducation.content.subtitle}</h2>
        <div className="pt-4">
          {matchSlugEducation.content.content.map((content) => (
            <p key={content.id} className="mt-4 text-lg">
              {content.text}
            </p>
          ))}
        </div>
        {matchSlugEducation.content.sources.length > 0 && (
          <div className="mt-8">
            <h5>Sources:</h5>
            {matchSlugEducation.content.sources.map((sources) => (
              <Link
                key={sources.id}
                href={sources.url}
                className="mt-2 block text-xs font-light break-words text-blue-500"
              >
                {sources.url}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const matchSlugEducation = education.find((e) => e.slug === slug);
  if (!matchSlugEducation) return notFound();

  return {
    title: `⚓ MyAnchor - Education - ${matchSlugEducation.title}`,
  };
}
