import { Header } from "@/components/Header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="background-color: var(--color-background) m-auto max-w-[460px]">
      <Header />
      <div className="flex grow flex-col bg-[#f6d298]">{children}</div>
    </div>
  );
}
