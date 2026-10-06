import type { Metadata } from "next";
import { TerminalTunnel } from "@/components/lab/TerminalTunnel";
import { LabSwitcher } from "@/components/lab/LabSwitcher";
import { TerminalSections } from "@/components/sections/TerminalSections";

export const metadata: Metadata = {
  title: "Lab: tunnel",
  robots: { index: false, follow: false },
};

export default function TunnelLabPage() {
  return (
    <>
      <TerminalTunnel />
      <TerminalSections />
      <LabSwitcher />
    </>
  );
}
