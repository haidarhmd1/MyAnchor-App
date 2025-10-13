import { categories } from "@/common/const/links";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const CategoryLinks = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={c.link}
          style={{
            display: "contents",
          }}
        >
          <Card
            className={twMerge(
              clsx(
                "flex",
                [
                  "relative",
                  "w-full",
                  "min-h-[225px]",
                  "rounded-[22px] border-none",
                  "bg-gradient-to-br",
                  "pt-4",
                  "shadow-[0_6px_18px_rgba(0,0,0,0.15)]",
                  "transform transition will-change-transform",
                  "active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40",
                  c.gradient.from,
                  c.gradient.to,
                ].join(" "),
              ),
            )}
          >
            <CardContent className="flex px-4">
              {/* Subtle noise & glossy overlay */}
              <div className="pointer-events-none absolute inset-0 [background-size:8px_8px] opacity-[0.15] mix-blend-overlay" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
              <div>
                <h3
                  className={`truncate text-lg leading-snug font-semibold text-white drop-shadow`}
                >
                  {c.title}
                </h3>
                <p className="mt-0.5 text-sm text-white/80 drop-shadow">
                  {c.description}
                </p>
              </div>
              <div
                className={`ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/35 shadow-inner backdrop-blur-[2px]`}
                aria-hidden
              >
                <div className="text-white drop-shadow">
                  <ArrowRight size={18} strokeWidth={2.25} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
