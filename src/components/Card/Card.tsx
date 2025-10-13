import Link from "next/link";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Card, CardContent } from "../ui/card";

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
    <Link
      href={link}
      style={{
        display: "contents",
      }}
    >
      <Card className={twMerge(clsx("flex", className))}>
        <CardContent className="flex px-4">
          {icon && <div className="mr-2 shrink-0">{icon}</div>}
          <div>
            <h4 className="text-[16px] leading-[24px] font-medium drop-shadow">
              {title}
            </h4>
            <p className="text-[14px] leading-[21px] font-normal text-[#617D8A] shadow-inner backdrop-blur-[2px]">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
