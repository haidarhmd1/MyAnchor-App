import { CardContainer } from "@/components/Card/Card";
import { education } from "@/const/links";
import { Metadata } from "next";

export default function EducationPage() {
  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("/illustration/psycho-education.png")`,
          backgroundPosition: "center",
        }}
      />
      <div className="p-4">
        <div>
          <h5 className="font-light">Psycho education</h5>
          <h2>Understand what Panic and anxiety is.</h2>
          <p className="sub mt-2">
            Learn and understand what a panic and anxiety attack or disorder is
            and try to understand the symptoms
          </p>
        </div>
        <div className="mt-6">
          {education.map((e) => (
            <CardContainer
              key={e.id}
              className="mx-4 mb-4"
              title={e.title}
              description={e.description}
              icon={
                <div
                  className="mr-2 h-16 w-16 rounded-md"
                  style={{
                    backgroundImage: `url(${e.imgSrc})`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                />
              }
              link={e.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Psychoeducation",
};
