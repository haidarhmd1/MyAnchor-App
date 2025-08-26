import Journal from "./_components/Journal";
import { Metadata } from "next";

export default function Page() {
  return (
    <div className="p-4">
      <Journal />
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure Tracker",
};
