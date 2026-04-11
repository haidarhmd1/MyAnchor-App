import { Metadata } from "next";
import AnxietyScreenerForm from "./AnxietyScreeningForm";

export default async function Page() {
  return (
    <section className="bg-background text-foreground px-4 py-4">
      <div className="mx-auto w-full max-w-2xl">
        <AnxietyScreenerForm />
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Moment Log",
};
