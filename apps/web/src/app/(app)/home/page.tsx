import { auth } from "@clerk/nextjs/server";
import { getHomeState } from "@/lib/api";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { getToken } = await auth();
  const token = await getToken();
  let homeState = null;
  try { homeState = await getHomeState(token!); } catch {}
  return <HomeClient homeState={homeState} />;
}
