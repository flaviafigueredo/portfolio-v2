import type { Metadata } from "next";
import { CityRun } from "@/components/background/CityRun";
import { LabSwitcher } from "@/components/lab/LabSwitcher";
import { TerminalSections } from "@/components/sections/TerminalSections";

export const metadata: Metadata = {
  title: "Lab: city",
  robots: { index: false, follow: false },
};

export default function CityLabPage() {
  return (
    <>
      <CityRun />
      <TerminalSections />
      <LabSwitcher />
    </>
  );
}
