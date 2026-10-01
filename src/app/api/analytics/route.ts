import { getAnxietyAnalytics } from "@/app/server/getAnxietyAnalytics";
import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-errors";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDateISO = searchParams.get("startDate");

    const data = await getAnxietyAnalytics(startDateISO);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return apiErrorResponse(error, "analytics_read_failed", request);
  }
};
