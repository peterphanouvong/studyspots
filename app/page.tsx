import { SpotsExplorer } from "@/components/spots-explorer";

export default function Home() {
  // Read server-side so the env var stays un-prefixed; the Maps JS API needs
  // the key in the browser regardless, so it's passed down to the client.
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? "";
  return <SpotsExplorer apiKey={apiKey} />;
}
