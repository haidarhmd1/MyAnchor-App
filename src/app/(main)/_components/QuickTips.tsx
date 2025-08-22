import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { tips } from "@/const/tips";
import Link from "next/link";

export const QuickTips = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start self-stretch">
        <h2>Tips</h2>
      </div>
      <Carousel>
        <CarouselContent>
          {tips.map((c) => {
            return (
              <CarouselItem key={c.id} className="basis-1/2">
                <Link
                  href={`tip/${c.slug}`}
                  style={{
                    display: "contents",
                  }}
                >
                  <div
                    className="h-[136px] w-full rounded-md"
                    style={{
                      backgroundImage: `url("${c.imgSrc}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="mt-4">
                    <h3>{c.title}</h3>
                    <p className="sub line-clamp-2 overflow-hidden text-ellipsis">
                      {c.description}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
