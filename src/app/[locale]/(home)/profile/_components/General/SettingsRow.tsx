export const SettingsRow = ({
  config,
  defaultConfig,
  setting,
}: {
  config: string;
  defaultConfig?: React.ReactNode;
  setting: React.ReactNode;
}) => {
  return (
    <div className="border-border flex min-h-18 items-center justify-between border-b py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-foreground text-base font-medium">{config}</p>
        <p className="text-muted-foreground text-sm leading-6">
          {defaultConfig}
        </p>
      </div>

      <div className="ml-4 shrink-0">
        <p className="text-primary text-sm font-medium">{setting}</p>
      </div>
    </div>
  );
};
