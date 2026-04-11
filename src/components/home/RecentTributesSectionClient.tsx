"use client";

import TributeLetterExperience from "@/components/tributes/TributeLetterExperience";
import type { Contribution } from "@/lib/types";

type RecentTributesSectionClientProps = {
  tributes: Contribution[];
};

export default function RecentTributesSectionClient({
  tributes,
}: RecentTributesSectionClientProps) {
  return <TributeLetterExperience tributes={tributes} />;
}
