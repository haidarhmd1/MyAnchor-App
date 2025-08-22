import { Metadata } from "next";
import { SoothingCircle } from "./_components/SoothingCircle";

export default function Page() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#E6F1F5]">
      <div className="pt-24">
        <SoothingCircle />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Panic Emergency",
};
