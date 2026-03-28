import { Switch } from "@/components/ui/switch";

type SettingsRowSwitchProps = {
  id: string;
  configTitle: string;
  configDescription: string;
};

export const SettingsRowSwitch = ({
  id,
  configTitle,
  configDescription,
}: SettingsRowSwitchProps) => {
  return (
    <label
      htmlFor={id}
      className="bg-card border-border flex min-h-18 cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 shadow-sm"
    >
      <div className="min-w-0">
        <p className="text-foreground text-base font-medium">{configTitle}</p>
        <p className="text-muted-foreground text-sm leading-6">
          {configDescription}
        </p>
      </div>

      <div className="ml-4 shrink-0">
        <Switch id={id} />
      </div>
    </label>
  );
};
