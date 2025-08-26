import ChallengeForm from "./_components/ChallengeForm";

export default function Page() {
  return (
    <div className="p-4">
      <h5>Planner</h5>
      <h2>Plan your challenge</h2>
      <div className="pt-8">
        <ChallengeForm />
      </div>
    </div>
  );
}
