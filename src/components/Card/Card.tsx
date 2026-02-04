import { Link } from "@/i18n/navigation";

import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Card, CardContent } from "../ui/card";
import { useLocale } from "next-intl";
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
  const locale = useLocale();
  const isRtl = locale.includes("ar");

  return (
    <Link
      href={link}
      style={{
        display: "contents",
      }}
    >
      <Card className={twMerge(clsx("flex", className))}>
        <CardContent className="flex px-4">
          {icon && (
            <div className={cn("shrink-0", isRtl ? "ml-2" : "mr-2")}>
              {icon}
            </div>
          )}
          <div>
            <h4 className="text-[16px] leading-6 font-medium">{title}</h4>
            <p className="text-[14px] leading-5.25 font-normal text-[#617D8A] backdrop-blur-[2px]">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
