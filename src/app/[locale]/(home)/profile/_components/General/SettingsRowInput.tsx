type SettingsRowInputProps = {
  label: string;
  value?: string | null;
};

export const SettingsRowInput = ({ label, value }: SettingsRowInputProps) => {
  return (
    <div className="my-2 flex flex-col rounded-3xl border p-4 py-2 shadow-xs">
      <span className="text-primary text-start text-base leading-6 font-medium">
        {label}
      </span>
      <span
        className="sub text-start text-xs"
        aria-label={`${label}: ${value ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
};
