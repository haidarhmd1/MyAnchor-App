"use client";

import { education } from "@/common/const/links";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

import { DateTime } from "luxon"; // you prefer Luxon
import { useTranslations } from "next-intl";

export const TodaysFocus = () => {
  const t = useTranslations();
  // Use UTC so server & client agree regardless of timezone
  const todayOrdinal = DateTime.utc().ordinal; // 1..366
  const index = education.length ? todayOrdinal % education.length : 0;
  const item = education[index];

  return (
    <Link
      href={item.link}
      style={{
        display: "contents",
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-start self-stretch">
          <h2>Today&apos;s Focus</h2>
        </div>

        <div className="flex flex-row items-center justify-between gap-4 self-stretch rounded-4xl bg-white p-4">
          <div>
            <h3>{t(item.titleKey)}</h3>
            <p className="sub">{t(item.descriptionKey)}</p>
          </div>
          <Image
            alt={t(item.titleKey)}
            src={item.imgSrc}
            width={112}
            height={112}
            className="h-28 w-28 flex-none rounded-2xl object-cover"
          />
        </div>
      </div>
    </Link>
  );
};
