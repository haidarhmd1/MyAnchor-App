import { Switch } from "@/components/ui/switch";

export const SettingsRowSwitch = ({
  configTitle,
  configDesctiption,
}: {
  configTitle: string;
  configDesctiption: string;
}) => {
  return (
    <div className="flex h-[72px] min-h-[72px] items-center justify-between self-stretch py-2 [background:#F7FAFC]">
      <div>
        <p className="self-stretch text-base leading-6 font-medium text-[#0D141C] [font-feature-settings:'dlig'_on]">
          {configTitle}
        </p>
        <p className="sub">{configDesctiption}</p>
      </div>
      <div>
        <Switch id="airplane-mode" />
      </div>
    </div>
  );
};
