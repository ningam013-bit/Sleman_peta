import { createFileRoute } from "@tanstack/react-router";
import { SlemanExplorer } from "@/components/sleman-explorer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <SlemanExplorer />;
}
