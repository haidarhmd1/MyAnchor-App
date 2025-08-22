import Journal from "./_components/Journal";
import { Metadata } from "next";

export default function Page() {
  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("/illustration/mindfull-exposure.png")`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <Journal />
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure Tracker",
};
