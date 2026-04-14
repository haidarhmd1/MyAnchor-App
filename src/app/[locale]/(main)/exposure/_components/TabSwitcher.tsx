import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NewChallenge,
  UnauthenticatedNewChallenge,
} from "./NewChallenge/NewChallenge";
import {
  PastChallenges,
  UnauthenticatedPastChallenges,
} from "./PastChallenges/PastChallenges";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { getTranslations } from "next-intl/server";
import { getUser } from "@/lib/auth/auth-helpers";

export const TabSwitcher = async () => {
  const auth = await getUser();
  const t = await getTranslations("exposure.tabSwitcher");

  return (
    <Tabs defaultValue="new-challenge" className="w-full space-y-4">
      <TabsList className="bg-muted text-muted-foreground grid h-auto w-full grid-cols-2 rounded-2xl p-1">
        <TabsTrigger
          value="new-challenge"
          className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-sm px-4 py-3 text-xs font-medium data-[state=active]:shadow-sm"
        >
          {t("newDailyChallenge")}
        </TabsTrigger>

        <TabsTrigger
          value="past-challenge"
          className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-sm px-4 py-3 text-xs font-medium data-[state=active]:shadow-sm"
        >
          {t("pastChallenges")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new-challenge" className="mt-0">
        {!auth ? (
          <SignInOverlayButton>
            <UnauthenticatedNewChallenge />
          </SignInOverlayButton>
        ) : (
          <NewChallenge />
        )}
      </TabsContent>

      <TabsContent value="past-challenge" className="mt-0">
        {!auth ? (
          <SignInOverlayButton>
            <UnauthenticatedPastChallenges />
          </SignInOverlayButton>
        ) : (
          <PastChallenges />
        )}
      </TabsContent>
    </Tabs>
  );
};
