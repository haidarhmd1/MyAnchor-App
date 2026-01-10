import { LanguageSwitcher } from "@/app/[locale]/(home)/profile/_components/LanguageSwitcher/LanguageSwitcher";
import { BackArrow } from "./_components/BackArrow";

export const SignInHeader = ({ title = "MyAnchor App" }) => {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-white/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="flex items-center">
        <BackArrow />
      </div>

      <h6 className="text-center font-bold">MyAnchor</h6>

      <div className="flex items-center">
        <LanguageSwitcher variant="xs" />
      </div>
    </header>
  );
};
