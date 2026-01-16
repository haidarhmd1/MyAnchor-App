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
    <Tabs defaultValue="new-challenge" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="new-challenge" className="p-4">
          {t("newDailyChallenge")}
        </TabsTrigger>
        <TabsTrigger value="past-challenge" className="p-4">
          {t("pastChallenges")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new-challenge">
        {!auth ? (
          <SignInOverlayButton>
            <UnauthenticatedNewChallenge />
          </SignInOverlayButton>
        ) : (
          <NewChallenge />
        )}
      </TabsContent>
      <TabsContent value="past-challenge">
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
