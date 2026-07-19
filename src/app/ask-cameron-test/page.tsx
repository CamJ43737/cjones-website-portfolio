import type { Metadata } from "next";
import { AskCameronTestDashboard } from "@/components/ai/AskCameronTestDashboard";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: `Ask Cameron Test Console — ${site.name}`,
  description:
    "Private developer console for testing Ask Cameron retrieval and local answers. Not for public navigation.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AskCameronTestPage() {
  return <AskCameronTestDashboard />;
}
