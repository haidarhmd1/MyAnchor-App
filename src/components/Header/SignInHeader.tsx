import { LanguageSwitcher } from "@/app/[locale]/(home)/profile/_components/LanguageSwitcher/LanguageSwitcher";
import { BackArrow } from "./_components/BackArrow";
import { Logo } from "../Brand/Logo";

export const SignInHeader = () => {
  return (
    <header className="bg-background/85 border-border sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between">
        <div className="flex items-center rounded-full border-2">
          <BackArrow />
        </div>

        <Logo />

        <div className="flex items-center">
          <LanguageSwitcher variant="xs" />
        </div>
      </div>
    </header>
  );
};
