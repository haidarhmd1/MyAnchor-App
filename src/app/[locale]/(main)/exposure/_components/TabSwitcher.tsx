import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewChallenge } from "./NewChallenge/NewChallenge";
import { PastChallenges } from "./PastChallenges/PastChallenges";

export const TabSwitcher = () => {
  return (
    <Tabs defaultValue="new-challenge" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="new-challenge" className="p-4">
          New Daily Challenge
        </TabsTrigger>
        <TabsTrigger value="past-challenge" className="p-4">
          Past Challenges
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
