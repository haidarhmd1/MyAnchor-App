type SettingsRowInputProps = {
  label: string;
  value?: string | null;
};

export const SettingsRowInput = ({ label, value }: SettingsRowInputProps) => {
  return (
    <div className="bg-card hover:bg-muted/60 border-border flex flex-col rounded-3xl border px-4 py-3 text-left shadow-sm transition">
      <span className="text-foreground text-base font-medium">{label}</span>
      <span
        className="text-muted-foreground text-sm leading-6"
        aria-label={`${label}: ${value ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
};
