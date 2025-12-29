import { Grounding } from "./_components/Grounding/Grounding";
import { BoxBreathing } from "./_components/BoxBreathing/BoxBreathing";
import { PhysicalAnchor } from "./_components/PhysicalAnchor/PhysicalAnchor";
import { PositiveReminder } from "./_components/PositiveReminder/PositiveReminder";

export default function page() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-center">You re not alone</h2>
      <p className="justify-start self-stretch text-center text-base leading-normal font-normal text-neutral-900">
        Remember, this feeling is temporary. You&apos;re strong, and you&apos;ll
        get through this. Focus on your breath and take it one step at a time.
      </p>
      <div className="mt-8">
        <h4 className="font-bold">Quick Actions</h4>
        <div className="mt-4 space-y-4">
          <Grounding />

          <BoxBreathing />

          <PhysicalAnchor />

          {/* <div className="flex space-x-4">
            <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
              <Brain className="self-center" />
            </div>
            <div>
              <h4>Mental Challenge</h4>
              <p className="text-sm font-extralight">
                Challenge anxious thoughts with logical reasoning.
              </p>
            </div>
          </div> */}
          <PositiveReminder />
        </div>
        {/* <div className="my-6 h-[1px] w-full bg-gray-200" />
        <div className="inline-flex h-10 w-full max-w-[480px] min-w-20 items-center justify-center overflow-hidden rounded-[20px] bg-gray-100 px-4">
          <div className="inline-flex flex-col items-center justify-start overflow-hidden">
            <button className="justify-start text-center text-sm leading-tight font-bold text-neutral-900">
              Call a Friend
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
