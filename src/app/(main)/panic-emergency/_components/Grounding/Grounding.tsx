import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Ear, Eye, Hand, HandFist, IceCream, Smile } from "lucide-react";

export const Grounding = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex space-x-4">
          <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
            <HandFist className="self-center" />
          </div>
          <div className="flex flex-col text-left">
            <h4>5-4-3-2-1 Grounding</h4>
            <p className="text-sm font-extralight">
              Engage your senses to ground yourself in the present moment.
            </p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-11/12 overflow-auto">
        <SheetHeader>
          <SheetTitle>5-4-3-2-1 Grounding</SheetTitle>
          <div className="space-y-8">
            <div className="my-8">Use your senses to return to the present</div>

            <div className="flex space-x-4">
              <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                <Eye className="self-center" />
              </div>
              <div className="flex flex-col text-left">
                <h4>5 Things You Can See</h4>
                <p className="text-sm font-extralight">
                  Look around and name five things.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                <Hand className="self-center" />
              </div>
              <div className="flex flex-col text-left">
                <h4>4 Things You Can Touch</h4>
                <p className="text-sm font-extralight">
                  Notice four different textures.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                <Ear className="self-center" />
              </div>
              <div className="flex flex-col text-left">
                <h4>3 Things You Can Hear</h4>
                <p className="text-sm font-extralight">
                  Identify three distinct sounds.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                <Smile className="self-center" />
              </div>
              <div className="flex flex-col text-left">
                <h4>2 Things You Can Smell</h4>
                <p className="text-sm font-extralight">
                  Recognize two different scents.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                <IceCream className="self-center" />
              </div>
              <div className="flex flex-col text-left">
                <h4>1 Thing You Can Taste</h4>
                <p className="text-sm font-extralight">
                  Acknowledge one thing you can taste.
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
