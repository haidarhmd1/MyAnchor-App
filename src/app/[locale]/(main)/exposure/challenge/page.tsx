import { prisma } from "../../../../../../lib/prisma";
import ChallengeForm from "./_components/ChallengeForm";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("challengePlanner");

  const challengesOptions = await prisma.challengeOption.findMany({
    select: {
      id: true,
      slug: true,
      label: true,
      description: true,
      engagement: true,
    },
  });

  if (!challengesOptions || challengesOptions.length === 0) {
    return (
      <section className="bg-background text-foreground space-y-6 px-4 py-4">
        <header className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
        </header>

        <div className="surface-soft rounded-4xl p-5 shadow-sm">
          <p className="text-muted-foreground text-sm leading-6">
            {t("error")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background text-foreground space-y-6 px-4 py-4">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>
      </header>

      <section className="pt-2">
        <ChallengeForm challengesOptions={challengesOptions} />
      </section>
    </section>
  );
}
