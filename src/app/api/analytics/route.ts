import { getAnxietyAnalytics } from "@/app/server/getAnxietyAnalytics";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const startDateISO = searchParams.get("startDate");

  const data = await getAnxietyAnalytics(startDateISO);

  return NextResponse.json(data, { status: 200 });
};
