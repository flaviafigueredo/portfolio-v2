import type { Metadata } from "next";
import { ParallaxCity } from "@/components/lab/ParallaxCity";
import { LabSwitcher } from "@/components/lab/LabSwitcher";
import { TerminalSections } from "@/components/sections/TerminalSections";

export const metadata: Metadata = {
  title: "Lab: parallax",
  robots: { index: false, follow: false },
};

export default function ParallaxLabPage() {
  return (
    <>
      <ParallaxCity />
      <TerminalSections />
      <LabSwitcher />
    </>
  );
}
