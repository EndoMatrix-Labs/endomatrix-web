import { auth } from "@clerk/nextjs/server";
import { getInsights } from "@/lib/api";
import InsightsClient from "./InsightsClient";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const { getToken } = await auth();
  const token = await getToken();
  let pattern = null;
  try { pattern = await getInsights(token!); } catch {}
  return <InsightsClient pattern={pattern} />;
}
