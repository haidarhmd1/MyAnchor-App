import { ResultForm } from "./_components/ResultForm";

export default function Page() {
  return (
    <div className="p-4">
      <h5>Tell us</h5>
      <h2>How was your experience with it?</h2>
      <div className="pt-8">
        <ResultForm />
      </div>
    </div>
  );
}
