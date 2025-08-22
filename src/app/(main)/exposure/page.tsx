import { CardContainer } from "@/components/Card/Card";
import { whyThisFeelsHardAtFirst } from "@/const/content";

export default function Page() {
  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("/illustration/understanding-anxiety.png")`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">Exposure Tracker</h5>
        <h2>{whyThisFeelsHardAtFirst.title}</h2>

        <div className="mb-4">
          {whyThisFeelsHardAtFirst.content.map((content) => (
            <p key={content.id} className="mt-4">
              {content.text}
            </p>
          ))}
        </div>

        <CardContainer
          className="w-full"
          title="Track your exposure"
          description="Today I did..."
          link="/exposure/tracker"
        />
      </div>
    </>
  );
}
