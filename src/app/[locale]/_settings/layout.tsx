import { Header } from "@/components/Header/Header";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="Settings" right={<div />} />
      <div className="px-4">{children}</div>
    </div>
  );
}
