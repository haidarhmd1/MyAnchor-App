import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewChallenge } from "./NewChallenge/NewChallenge";
import { PastChallenges } from "./PastChallenges/PastChallenges";
import { useTranslations } from "next-intl";

export const TabSwitcher = () => {
  const t = useTranslations("exposure.tabSwitcher");

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
        <NewChallenge />
      </TabsContent>
      <TabsContent value="past-challenge">
        <PastChallenges />
      </TabsContent>
    </Tabs>
  );
};
