"use client";

import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

export const CardContainer = ({
  title,
  description,
  link,
  icon,
  className,
}: {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Link href={link} className="block">
      <Card
        className={cn(
          "border-border bg-card hover:bg-muted/40 flex p-2 shadow-sm transition-all",
          "hover:-translate-y-px hover:shadow-md",
          className,
        )}
      >
        <CardContent className="flex w-full items-start gap-3 p-2">
          {icon ? <div className="shrink-0">{icon}</div> : null}

          <div className="min-w-0 flex-1">
            <h4 className="text-foreground text-base leading-6 font-medium">
              {title}
            </h4>

            <p className="text-muted-foreground mt-1 text-sm leading-5">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
