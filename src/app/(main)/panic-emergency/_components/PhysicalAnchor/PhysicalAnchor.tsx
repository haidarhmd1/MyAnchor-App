"use client";

import { Anchor } from "lucide-react";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";

export const PhysicalAnchor = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setIsOpen(true)}>
        <div className="flex space-x-4">
          <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
            <Anchor className="self-center" />
          </div>
          <div className="flex flex-col text-left">
            <h4>Physical Anchor</h4>
            <p className="text-sm font-extralight">
              Focus on a physical object to anchor yourself in reality.
            </p>
          </div>
        </div>
      </div>
      <Sheet detent="content" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content className="p-4">
            <div className="space-y-8">
              <section>
                <h2 className="my-4">What it means?</h2>
                <p>
                  A physical anchor is any tangible object you focus on with
                  your senses to pull yourself back into the present moment.
                  When anxiety or panic spirals, your mind feels detached or
                  overwhelmed. By concentrating on something real, solid, and
                  right here, you remind your nervous system: I am safe, I am
                  present.
                </p>
              </section>

              <section>
                <h2 className="my-4">How to do it</h2>
                <div className="space-y-3">
                  <p>
                    Pick an object near you. (Example: a pen, a stone, your
                    phone, keys, a cup, a chair edge.)
                  </p>

                  <p>
                    Look at it carefully. Notice its shape, size, colors, tiny
                    details.
                  </p>

                  <p>
                    Touch it slowly. Feel the temperature, weight, texture,
                    edges. Run your fingers across it.
                  </p>

                  <p>
                    Name what you notice out loud or in your mind. Example:
                    “This pen is smooth. It feels cool. It has black ink. It’s
                    solid in my hand.”
                  </p>

                  <p>
                    Stay with it for 30–60 seconds. Breathe slowly while keeping
                    attention on the object.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="my-4">Why it works</h2>
                <div className="space-y-3">
                  <p>
                    Interrupts spiraling thoughts by redirecting attention
                    outward.
                  </p>

                  <p>
                    Reassures your body — the solidity of an object contrasts
                    the “unreal” feeling of panic.
                  </p>

                  <p>
                    Engages multiple senses (sight, touch, sometimes even
                    smell), which strengthens grounding.
                  </p>
                </div>
              </section>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
};
