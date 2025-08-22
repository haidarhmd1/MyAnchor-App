import { Metadata } from "next";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="p-4">{children}</div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure Tracker",
};
