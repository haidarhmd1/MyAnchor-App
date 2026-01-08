type SettingsRowInputProps = {
  label: string;
  value?: string | null;
};

export const SettingsRowInput = ({ label, value }: SettingsRowInputProps) => {
  return (
    <div className="my-2 flex flex-col rounded-2xl border p-4 py-2">
      <span className="text-start text-base leading-6 font-medium text-[#0D141C]">
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
