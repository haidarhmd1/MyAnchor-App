import { LanguageSwitcher } from "@/app/[locale]/(home)/profile/_components/LanguageSwitcher/LanguageSwitcher";
import { BackArrow } from "./_components/BackArrow";

export const SignInHeader = ({ title = "MyAnchor" }) => {
  return (
    <header className="bg-background/85 border-border sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between">
        <div className="flex items-center">
          <BackArrow />
        </div>

        <h6 className="text-foreground text-center text-lg font-semibold tracking-tight">
          {title}
        </h6>

        <div className="flex items-center">
          <LanguageSwitcher variant="xs" />
        </div>
      </div>
    </header>
  );
};
